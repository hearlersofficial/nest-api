import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItems } from "~counselings/domains/instructionItems/models/instructionItems";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class InstructionItemsRepository {
  abstract findByInstructionItemId(instructionItemId: UniqueEntityId, options?: FindOneOptions<InstructionItemEntity>): Promise<InstructionItems | null>;
  abstract findMany(options?: FindManyOptions<InstructionItemEntity>): Promise<InstructionItems[]>;
  abstract save(instructionItem: InstructionItems): Promise<InstructionItems>;
  abstract save(instructionItems: InstructionItems[]): Promise<InstructionItems[]>;
}
