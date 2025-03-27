import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionWithItems } from "~counselings/applications/types/instruction.type";
import { InstructionItemsService } from "~counselings/domains/instructionItems/instructionItems.service";
import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";
import { InstructionsService } from "~counselings/domains/instructions/instructions.service";
import { Instructions } from "~counselings/domains/instructions/models/instructions";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class InstructionsFacade {
  constructor(private readonly instructionService: InstructionsService, private readonly instructionItemService: InstructionItemsService) {}

  async createInstruction(params: { name: string; initialSentence: string | null; instructionItemIds: UniqueEntityId[] }): Promise<InstructionWithItems> {
    const { name, initialSentence, instructionItemIds } = params;
    const instructionItems = await this.instructionItemService.findMany({ ids: instructionItemIds });
    if (instructionItems.length !== instructionItemIds.length) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Instruction items not found");
    }

    const instruction: Instructions = await this.instructionService.create({ name, initialSentence });
    const updateInstructionMapsResult = instruction.updateInstructionMaps(instructionItemIds);
    if (!updateInstructionMapsResult) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update instruction maps");
    }
    await this.instructionService.update(instruction);

    return {
      instruction,
      instructionItems,
    };
  }

  async findInstructions(params: { name?: string }): Promise<InstructionWithItems[]> {
    const instructions: Instructions[] = await this.instructionService.findMany({ name: params.name });
    const result: InstructionWithItems[] = [];
    for (const instruction of instructions) {
      const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });
      result.push({
        instruction,
        instructionItems,
      });
    }

    return result;
  }

  async findInstructionById(params: { instructionId: UniqueEntityId }): Promise<InstructionWithItems> {
    const { instructionId } = params;
    const instruction: Instructions = await this.instructionService.getOne({ instructionId });
    const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });

    return {
      instruction,
      instructionItems,
    };
  }

  async updateInstruction(params: {
    instructionId: UniqueEntityId;
    name?: string;
    initialSentence?: string | null;
    instructionItemIds?: UniqueEntityId[];
  }): Promise<InstructionWithItems> {
    const { instructionId, name, initialSentence, instructionItemIds } = params;
    const instruction: Instructions = await this.instructionService.getOne({ instructionId });
    instruction.update({ name, initialSentence });

    let instructionItems: InstructionItems[] = [];
    if (instructionItemIds !== undefined) {
      instructionItems = await this.instructionItemService.findMany({ ids: instructionItemIds });
      if (instructionItems.length !== instructionItemIds.length) {
        throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Instruction items not found");
      }
      const updateInstructionMapsResult = instruction.updateInstructionMaps(instructionItemIds);
      if (!updateInstructionMapsResult) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update instruction maps");
      }
    }
    await this.instructionService.update(instruction);

    return {
      instruction,
      instructionItems,
    };
  }
}
