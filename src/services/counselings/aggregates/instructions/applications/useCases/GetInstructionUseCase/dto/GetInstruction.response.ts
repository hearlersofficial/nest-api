import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";

export interface GetInstructionUseCaseResponse extends UseCaseCoreResponse {
  instruction?: Instructions;
}
