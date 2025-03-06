import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { Instructions } from "~counselings/aggregates/instructions/domain/instructions";
import { CreateInstructionCommand, CreateInstructionCommandResult } from "~counselings/applications/commands/CreateInstruction/CreateInstruction.command";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateInstructionCommand)
export class CreateInstructionHandler implements ICommandHandler<CreateInstructionCommand> {
  constructor(private readonly instructionService: InstructionService, private readonly instructionItemService: InstructionItemService) {}

  async execute(command: CreateInstructionCommand): Promise<CreateInstructionCommandResult> {
    const { name, initialSentence, instructionItemIds } = command.props;
    const instruction: Instructions = await this.instructionService.create({ name, initialSentence });
    const updateInstructionMapsResult = instruction.updateInstructionMaps(instructionItemIds);
    if (!updateInstructionMapsResult) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update instruction maps");
    }

    await this.instructionService.update(instruction);

    const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });

    const result: CreateInstructionCommandResult = {
      instruction,
      instructionItems,
    };
    return result;
  }
}
