import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { InstructionItems, InstructionItemsProps } from "~counselings/aggregates/instructionItems/domain/instructionItems";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlInstructionItemsMapper {
  static toDomain(entity: InstructionItemEntity): InstructionItems | null {
    if (!entity) {
      return null;
    }

    const instructionItemsProps: InstructionItemsProps = {
      body: entity.body,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const instructionItemsOrError = InstructionItems.create(instructionItemsProps, new UniqueEntityId(entity.id));

    if (instructionItemsOrError.isFailure) {
      throw new InternalServerErrorException(instructionItemsOrError.errorValue);
    }

    return instructionItemsOrError.value;
  }

  static toEntity(instructionItems: InstructionItems): InstructionItemEntity {
    const entity = new InstructionItemEntity();

    if (!instructionItems.id.isNewIdentifier()) {
      entity.id = instructionItems.id.getString();
    }

    entity.body = instructionItems.body;

    entity.createdAt = formatDayjsToUtcString(instructionItems.createdAt);
    entity.updatedAt = formatDayjsToUtcString(instructionItems.updatedAt);
    entity.deletedAt = instructionItems.deletedAt ? formatDayjsToUtcString(instructionItems.deletedAt) : null;

    return entity;
  }
}
