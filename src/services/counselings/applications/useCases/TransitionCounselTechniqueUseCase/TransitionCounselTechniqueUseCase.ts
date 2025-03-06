import { UseCase } from "~shared/core/applications/UseCase";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { TransitionCounselTechniqueRequest } from "~counselings/applications/useCases/TransitionCounselTechniqueUseCase/dto/TransitionCounselTechnique.request";
import { TransitionCounselTechniqueResponse } from "~counselings/applications/useCases/TransitionCounselTechniqueUseCase/dto/TransitionCounselTechnique.response";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Injectable } from "@nestjs/common";

@Injectable()
export class TransitionCounselTechniqueUseCase
  implements UseCase<TransitionCounselTechniqueRequest, TransitionCounselTechniqueResponse>
{
  constructor(
    private readonly counselService: CounselService,
    private readonly counselTechniqueService: CounselTechniqueService,
    private readonly counselorService: CounselorService,
  ) {}

  async execute(request: TransitionCounselTechniqueRequest): Promise<TransitionCounselTechniqueResponse> {
    const { counsel } = request;

    const currentCounselTechnique = await this.counselTechniqueService.findOne(counsel.counselTechniqueId);
    if (!currentCounselTechnique) {
      return {
        ok: false,
        error: "CounselTechnique not found",
      };
    }

    // 다음 프롬프트가 정해진 경우
    if (currentCounselTechnique.nextTechniqueId) {
      const nextCounselTechnique = await this.counselTechniqueService.findOne(currentCounselTechnique.nextTechniqueId);
      if (!nextCounselTechnique) {
        return {
          ok: false,
          error: "Next CounselTechnique not found",
        };
      }

      counsel.updateCounselTechniqueId(nextCounselTechnique.id);
      await this.counselService.update(counsel);

      return {
        ok: true,
        counsel,
      };
    }
    // 다음 프롬프트가 정해지지 않은 경우
    else {
      switch (currentCounselTechnique.counselTechniqueStage) {
        // 초기 단계 종료
        case CounselTechniqueStage.INITIAL:
          const counselor = await this.counselorService.getById(counsel.counselorId);
          const nextCounselTechnique = await this.counselTechniqueService.findFirst({
            stage: CounselTechniqueStage.MIDDLE,
            toneId: counselor.toneId,
          });
          if (!nextCounselTechnique) {
            return {
              ok: false,
              error: "Next CounselTechnique not found",
            };
          }

          counsel.updateCounselTechniqueId(nextCounselTechnique.id);
          await this.counselService.update(counsel);

          return {
            ok: true,
            counsel,
          };
        // 중간 단계 종료
        case CounselTechniqueStage.MIDDLE:
          // TODO: 상담 기법 종료되었을 때의 처리
          return {
            ok: true,
            counsel,
          };
        default:
          return {
            ok: false,
            error: "Invalid CounselTechniqueStage",
          };
      }
    }
  }
}
