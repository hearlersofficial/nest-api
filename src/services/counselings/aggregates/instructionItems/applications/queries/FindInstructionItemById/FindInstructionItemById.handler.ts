import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { FindInstructionItemByIdQuery } from "~counselings/aggregates/instructionItems/applications/queries/FindInstructionItemById/FindInstructionItemById.query";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindInstructionItemByIdQuery)
export class FindInstructionItemByIdHandler implements IQueryHandler<FindInstructionItemByIdQuery> {
  constructor(private readonly instructionItemService: InstructionItemService) {}

  async execute(query: FindInstructionItemByIdQuery): Promise<InstructionItems> {
    const instructionItem = await this.instructionItemService.getById(query.instructionItemId);
    return instructionItem;
  }
}
