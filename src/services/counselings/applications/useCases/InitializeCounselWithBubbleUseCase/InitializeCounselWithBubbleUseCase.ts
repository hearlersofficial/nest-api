import { Injectable } from "@nestjs/common";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { CreateCounselUseCase } from "~/src/aggregates/counsels/applications/useCases/CreateCounselUseCase/CreateCounselUseCase";
import { CreateCounselMessageUseCase } from "~/src/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/CreateCounselMessageUseCase";
import { UpdateCounselUseCase } from "~/src/aggregates/counsels/applications/useCases/UpdateCounselUseCase/UpdateCounselUseCase";
import { InitializeCounselWithBubbleUseCaseRequest } from "./dto/InitializeCounselWithBubble.request";
import { InitializeCounselWithBubbleUseCaseResponse } from "./dto/InitializeCounselWithBubble.response";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { CounselStage } from "~/src/shared/enums/CounselStage.enum";
import { ChatCompletionMessageParam } from "openai/resources";
import { GenerateGptResponseUseCase } from "../GenerateGptResponseUseCase/GenerateGptResponseUseCase";
import { GetCounselPromptByTypeUseCase } from "~/src/aggregates/counselPrompts/applications/useCases/GetCounselPromptByTypeUseCase/GetCounselPromptByTypeUseCase";

@Injectable()
export class InitializeCounselWithBubbleUseCase implements UseCase<InitializeCounselWithBubbleUseCaseRequest, InitializeCounselWithBubbleUseCaseResponse> {
  constructor(
    private readonly createCounselUseCase: CreateCounselUseCase,
    private readonly createCounselMessageUseCase: CreateCounselMessageUseCase,
    private readonly getCounselPromptByTypeUseCase: GetCounselPromptByTypeUseCase,
    private readonly generateGptResponseUseCase: GenerateGptResponseUseCase,
    private readonly updateCounselUseCase: UpdateCounselUseCase,
  ) {}

  async execute(request: InitializeCounselWithBubbleUseCaseRequest): Promise<InitializeCounselWithBubbleUseCaseResponse> {
    const { userId, counselor, introMessage, responseMessage } = request;

    // 상담 생성
    const createCounselResult = await this.createCounselUseCase.execute({ userId, counselorId: counselor.id.getNumber() });
    if (!createCounselResult.ok) {
      return { ok: false, error: createCounselResult.error };
    }
    const counsel = createCounselResult.counsel;
    const counselMessages: CounselMessages[] = [];

    // introMessage 추가
    const firstMessage = {
      counselId: counsel.id.getNumber(),
      userId: userId,
      message: introMessage,
      isUserMessage: false,
    };
    const createFirstCounselMessgeResult = await this.createCounselMessageUseCase.execute(firstMessage);
    if (!createFirstCounselMessgeResult.ok) {
      return { ok: false, error: createFirstCounselMessgeResult.error };
    }
    counselMessages.push(createFirstCounselMessgeResult.counselMessage);

    // responseMessage 추가
    const secondMessage = {
      counselId: counsel.id.getNumber(),
      userId: userId,
      message: responseMessage,
      isUserMessage: true,
    };
    const createSecondCounselMessgeResult = await this.createCounselMessageUseCase.execute(secondMessage);
    if (!createSecondCounselMessgeResult.ok) {
      return { ok: false, error: createSecondCounselMessgeResult.error };
    }
    counselMessages.push(createSecondCounselMessgeResult.counselMessage);

    // 극단적 상태 체크
    if (createSecondCounselMessgeResult.counselMessage.checkExtreme()) {
      counsel.updateCounselStage(CounselStage.EXTREME);
    }

    const stage = counsel.counselStage;

    // 시스템 프롬프트 가져오기
    // 유저 정보 가져와 집어넣는 로직 필요(프롬프트에서 사용하는 유저 정보 구체화 필요)
    const prompts: ChatCompletionMessageParam[] = [];
    const systemPromptType = counselor.decideSystemPrompt(stage);
    const getPromptResult = await this.getCounselPromptByTypeUseCase.execute({ promptType: systemPromptType });
    if (!getPromptResult.ok) {
      return { ok: false, error: getPromptResult.error };
    }
    const systemPrompt = getPromptResult.counselPrompt;
    prompts.push(systemPrompt.makePrompt(counselor));

    prompts.push(createFirstCounselMessgeResult.counselMessage.makePrompt());
    prompts.push(createSecondCounselMessgeResult.counselMessage.makePrompt());

    // 응답 생성
    const generateGptResponseResult = await this.generateGptResponseUseCase.execute({ prompts });
    if (!generateGptResponseResult.ok) {
      return { ok: false, error: generateGptResponseResult.error };
    }
    const response = generateGptResponseResult.response;

    // 시스템 메시지 추가
    const createSystemMessageResult = await this.createCounselMessageUseCase.execute({
      counselId: counsel.id.getNumber(),
      userId: userId,
      message: response,
      isUserMessage: false,
    });
    if (!createSystemMessageResult.ok) {
      return { ok: false, error: createSystemMessageResult.error };
    }
    const systemMessage = createSystemMessageResult.counselMessage;
    counselMessages.push(systemMessage);

    // last message 저장 및 상담 정보 업데이트
    counsel.saveLastMessage(systemMessage);
    const updateCounselResult = await this.updateCounselUseCase.execute({ toUpdateCounsel: counsel });
    if (!updateCounselResult.ok) {
      return { ok: false, error: updateCounselResult.error };
    }
    const updatedCounsel = updateCounselResult.counsel;

    const result = {
      ok: true,
      counsel: updatedCounsel,
      counselMessages,
    };

    return result;
  }
}
