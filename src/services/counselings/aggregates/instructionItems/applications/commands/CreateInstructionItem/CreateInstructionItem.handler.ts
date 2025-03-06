import { CreateInstructionItemCommand } from "~counselings/aggregates/instructionItems/applications/commands/CreateInstructionItem/CreateInstructionItem.command";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateInstructionItemCommand)
export class CreateInstructionItemHandler implements ICommandHandler<CreateInstructionItemCommand> {
  constructor(private readonly instructionItemService: InstructionItemService) {}

  async execute(command: CreateInstructionItemCommand): Promise<InstructionItems> {
    const { body } = command.props;
    const instructionItem: InstructionItems = await this.instructionItemService.create({ body });
    return instructionItem;
  }
}
