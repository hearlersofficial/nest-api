import { Injectable } from "@nestjs/common";
import { BranchCounselStageUseCaseRequest } from "./dto/BranchCounselStage.request";
import { BranchCounselStageUseCaseResponse } from "./dto/BranchCounselStage.response";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import OpenAI from "openai";
import { CounselStage } from "~/src/shared/enums/CounselStage.enum";
import { GetCounselPromptByTypeUseCase } from "~/src/aggregates/counselPrompts/applications/useCases/GetCounselPromptByTypeUseCase/GetCounselPromptByTypeUseCase";
import { CounselPrompts } from "~/src/aggregates/counselPrompts/domain/CounselPrompts";
import { CounselPromptType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";

@Injectable()
export class BranchCounselStageUseCase implements UseCase<BranchCounselStageUseCaseRequest, BranchCounselStageUseCaseResponse> {
  private openai: OpenAI;

  constructor(private readonly getCounselPromptByTypeUseCase: GetCounselPromptByTypeUseCase) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || "",
    });
  }

  async execute(request: BranchCounselStageUseCaseRequest): Promise<BranchCounselStageUseCaseResponse> {
    const { prompts } = request;

    const getCounselPromptResult = await this.getCounselPromptByTypeUseCase.execute({ promptType: CounselPromptType.BRANCH_MSG });
    if (!getCounselPromptResult.ok) {
      return {
        ok: false,
        error: getCounselPromptResult.error,
      };
    }
    const branchPrompt: CounselPrompts = getCounselPromptResult.counselPrompt;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        branchPrompt.makePrompt(),
        {
          role: "user",
          content: JSON.stringify(prompts),
        },
      ],
      temperature: 0,
    });
    const branch = completion?.choices[0]?.message?.content;
    if (!branch) {
      return {
        ok: false,
        error: "상담 분기에 실패했습니다.",
      };
    }
    let branchedStage: CounselStage = null;

    if (branch.includes("1")) {
      branchedStage = CounselStage.POSITIVE;
    } else if (branch.includes("2")) {
      branchedStage = CounselStage.NEGATIVE_WITH_REASON;
    } else if (branch.includes("3")) {
      branchedStage = CounselStage.NEGATIVE_WITHOUT_REASON;
    } else {
      branchedStage = CounselStage.POSITIVE;
    }

    return {
      ok: true,
      branchedStage,
    };
  }
}
