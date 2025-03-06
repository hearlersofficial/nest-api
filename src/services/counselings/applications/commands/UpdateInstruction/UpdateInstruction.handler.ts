import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { UpdateInstructionCommand, UpdateInstructionCommandResult } from "~counselings/applications/commands/UpdateInstruction/UpdateInstruction.command";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInstructionCommand)
export class UpdateInstructionHandler implements ICommandHandler<UpdateInstructionCommand> {
  constructor(private readonly instructionService: InstructionService, private readonly instructionItemService: InstructionItemService) {}

  async execute(command: UpdateInstructionCommand): Promise<UpdateInstructionCommandResult> {
    const { instructionId, name, initialSentence, instructionItemIds } = command.props;
    const instruction: Instructions = await this.instructionService.getById(instructionId);
    instruction.update({ name, initialSentence });
    if (instructionItemIds) {
      const updateInstructionMapsResult = instruction.updateInstructionMaps(instructionItemIds);
      if (updateInstructionMapsResult.isFailure) {
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update instruction maps");
      }
    }
    await this.instructionService.update(instruction);

    const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });

    const result: UpdateInstructionCommandResult = {
      instruction,
      instructionItems,
    };

    return result;
  }
}
