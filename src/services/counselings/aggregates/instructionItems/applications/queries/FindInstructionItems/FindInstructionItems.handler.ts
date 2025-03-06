import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { FindInstructionItemsQuery } from "~counselings/aggregates/instructionItems/applications/queries/FindInstructionItems/FindInstructionItems.query";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindInstructionItemsQuery)
export class FindInstructionItemsHandler implements IQueryHandler<FindInstructionItemsQuery> {
  constructor(private readonly instructionItemService: InstructionItemService) {}

  async execute(query: FindInstructionItemsQuery): Promise<InstructionItems[]> {
    const instructionItems = await this.instructionItemService.findMany(query.props);
    return instructionItems;
  }
}
