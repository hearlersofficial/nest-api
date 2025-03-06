import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { FindInstructionByIdQuery, FindInstructionByIdQueryResult } from "~counselings/applications/queries/FindInstructionById/FindInstructionById.query";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindInstructionByIdQuery)
export class FindInstructionByIdHandler implements IQueryHandler<FindInstructionByIdQuery> {
  constructor(private readonly instructionService: InstructionService, private readonly instructionItemService: InstructionItemService) {}

  async execute(query: FindInstructionByIdQuery): Promise<FindInstructionByIdQueryResult> {
    const instruction = await this.instructionService.getById(query.instructionId);

    const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });

    const result: FindInstructionByIdQueryResult = {
      instruction,
      instructionItems,
    };

    return result;
  }
}
