import { UpdateInstructionItemCommand } from "~counselings/aggregates/instructionItems/applications/commands/UpdateInstructionItem/UpdateInstructionItem.command";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateInstructionItemCommand)
export class UpdateInstructionItemHandler implements ICommandHandler<UpdateInstructionItemCommand> {
  constructor(private readonly instructionItemService: InstructionItemService) {}

  async execute(command: UpdateInstructionItemCommand): Promise<InstructionItems> {
    const { instructionItemId, body } = command.props;
    const instructionItem: InstructionItems = await this.instructionItemService.getById(instructionItemId);
    instructionItem.update({ body });
    await this.instructionItemService.update(instructionItem);
    return instructionItem;
  }
}
