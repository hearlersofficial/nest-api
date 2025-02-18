import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

export interface GetInstructionItemListResponse extends UseCaseCoreResponse {
  instructionItemList?: InstructionItems[];
}
