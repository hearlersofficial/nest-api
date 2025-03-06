import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { FindInstructionsQuery, FindInstructionsQueryResult } from "~counselings/applications/queries/FindInstructions/FindInstructions.query";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindInstructionsQuery)
export class FindInstructionsHandler implements IQueryHandler<FindInstructionsQuery> {
  constructor(private readonly instructionService: InstructionService, private readonly instructionItemService: InstructionItemService) {}

  async execute(query: FindInstructionsQuery): Promise<FindInstructionsQueryResult> {
    const instructions = await this.instructionService.findMany(query.props);
    const result: FindInstructionsQueryResult = {
      instructions: [],
    };
    for (const instruction of instructions) {
      const instructionItems = await this.instructionItemService.findMany({ ids: instruction.instructionMaps.map((map) => map.instructionItemId) });
      result.instructions.push({
        instruction,
        instructionItems,
      });
    }
    return result;
  }
}
