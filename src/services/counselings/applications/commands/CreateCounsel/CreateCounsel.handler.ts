import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselMessageService } from "~counselings/aggregates/counselMessages/applications/counselMessage.service";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import {
  CreateCounselCommand,
  CreateCounselCommandResult,
} from "~counselings/applications/commands/CreateCounsel/CreateCounsel.command";
import { ProceedCounselingUseCase } from "~counselings/applications/useCases/ProceedCounselingUseCase/ProceedCounselingUseCase";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCounselCommand)
export class CreateCounselHandler implements ICommandHandler<CreateCounselCommand> {
  private readonly FirstMessage =
    "안녕! 여기는 내 상담실이야. 여기서는 무슨 이야기든 털어놓을 수 있어. 같이 이야기해볼래?";

  constructor(
    private readonly counselService: CounselService,
    private readonly counselMessageService: CounselMessageService,
    private readonly counselorService: CounselorService,
    private readonly counselTechniqueService: CounselTechniqueService,
    private readonly proceedCounselingUseCase: ProceedCounselingUseCase,
  ) {}

  async execute(command: CreateCounselCommand): Promise<CreateCounselCommandResult> {
    const { userId, counselorId, introMessage, responseMessage } = command.props;

    // 상담사 확인
    const counselor = await this.counselorService.findOne(counselorId);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }

    // 초기 프롬프트 가져오기
    const firstCounselTechnique = await this.counselTechniqueService.findFirst({
      stage: CounselTechniqueStage.INITIAL,
    });
    if (!firstCounselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselTechnique not found");
    }

    // 상담 생성
    const createdCounsel = await this.counselService.create({
      userId,
      counselorId,
      counselTechniqueId: firstCounselTechnique.id,
      // TODO: 의미있는 값 넣기
      counselorUserRelationshipId: new UniqueEntityId(),
    });

    const withBubble: boolean = introMessage && responseMessage ? true : false;

    let counselResult: Counsels;
    const counselMessagesResult: CounselMessages[] = [];

    if (withBubble) {
      // IntroMessage 생성
      if (!isDefined(introMessage)) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "IntroMessage is required");
      }
      const createdIntroMessage = await this.counselMessageService.create({
        counselId: createdCounsel.id,
        userId: createdCounsel.userId,
        counselTechniqueId: createdCounsel.counselTechniqueId,
        message: introMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdIntroMessage);

      // ResponseMessage를 통해 상담 진행
      const proceedCounselingResult = await this.proceedCounselingUseCase.execute({
        counsel: createdCounsel,
        userMessage: responseMessage as string,
      });
      if (!proceedCounselingResult.ok) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          proceedCounselingResult.error as string,
        );
      }

      counselResult = proceedCounselingResult.counsel;
      counselMessagesResult.push(proceedCounselingResult.createdCounselMessage);
      counselMessagesResult.push(proceedCounselingResult.counselorResponseMessage);
    } else {
      // 초기 메시지 생성
      const createdFirstMessage = await this.counselMessageService.create({
        counselId: createdCounsel.id,
        userId: createdCounsel.userId,
        counselTechniqueId: createdCounsel.counselTechniqueId,
        message: this.FirstMessage,
        isUserMessage: false,
      });
      counselMessagesResult.push(createdFirstMessage);

      // 마지막 채팅 업데이트
      const saveLastMessageResult = createdCounsel.saveLastMessage(createdFirstMessage);
      if (saveLastMessageResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, saveLastMessageResult.error as string);
      }
      counselResult = await this.counselService.update(createdCounsel);
    }

    return { counsel: counselResult, counselMessages: counselMessagesResult };
  }
}
