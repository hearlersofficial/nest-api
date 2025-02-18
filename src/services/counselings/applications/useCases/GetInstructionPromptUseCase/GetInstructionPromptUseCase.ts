import { UseCase } from "~shared/core/applications/UseCase";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetInstructionItemListUseCase } from "~counselings/aggregates/instructionItems/applications/useCases/GetInstructionItemListUseCase/GetInstructionItemListUseCase";
import { GetInstructionUseCase } from "~counselings/aggregates/instructions/applications/useCases/GetInstructionUseCase/GetInstructionUseCase";
import { GetInstructionPromptUseCaseRequest } from "~counselings/applications/useCases/GetInstructionPromptUseCase/dto/GetInstructionPrompt.request";
import { GetInstructionPromptUseCaseResponse } from "~counselings/applications/useCases/GetInstructionPromptUseCase/dto/GetInstructionPrompt.response";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class GetInstructionPromptUseCase implements UseCase<GetInstructionPromptUseCaseRequest, GetInstructionPromptUseCaseResponse> {
  constructor(private readonly getInstructionUseCase: GetInstructionUseCase, private readonly getInstructionItemListUseCase: GetInstructionItemListUseCase) {}

  async execute(request: GetInstructionPromptUseCaseRequest): Promise<GetInstructionPromptUseCaseResponse> {
    const { instructionId } = request;

    const getInstructionResult = await this.getInstructionUseCase.execute({ instructionId });
    if (!getInstructionResult.ok) {
      return { ok: false, error: getInstructionResult.error };
    }
    const instruction = getInstructionResult.instruction;
    const instructionItemIds = instruction.instructionMaps.map((instructionMap) => instructionMap.instructionItemId);

    const getInstructionItemListResult = await this.getInstructionItemListUseCase.execute({ instructionItemIds });
    if (!getInstructionItemListResult.ok) {
      return { ok: false, error: getInstructionItemListResult.error };
    }
    const instructionItemList = getInstructionItemListResult.instructionItemList;

    const instructionItemMap = new Map(instructionItemList.map((item) => [item.id.getString(), item]));

    let prompt = "";
    if (instruction.initialSentence) {
      prompt += `${instruction.initialSentence}\n`;
    }

    // instructionItemIds 순서 보장
    if (instruction.instructionMaps.length > 0) {
      prompt += instruction.instructionMaps
        .map((instructionMap) => {
          const instructionItem = instructionItemMap.get(instructionMap.instructionItemId.getString());
          if (!instructionItem) {
            throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "InstructionItem not found");
          }
          return `${instructionMap.sequence}. ${instructionItem.body}`;
        })
        .join("\n");
    }

    return { ok: true, prompt };
  }
}
