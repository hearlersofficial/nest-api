import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { CounselStage } from "~shared/enums/CounselStage.enum";

export interface BranchCounselStageUseCaseResponse extends UseCaseCoreResponse {
  branchedStage?: CounselStage;
}
