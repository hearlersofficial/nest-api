import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItems, InstructionItemsProps } from "~counselings/domains/instructionItems/models/instructionItems";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlInstructionItemsMapper {
  static toDomain(entity: InstructionItemEntity): InstructionItems | null {
    if (!entity) {
      return null;
    }

    const instructionItemsProps: InstructionItemsProps = {
      body: entity.body,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const instructionItemsOrError = InstructionItems.create(instructionItemsProps, new UniqueEntityId(entity.id));

    if (instructionItemsOrError.isFailure) {
      throw new InternalServerErrorException(instructionItemsOrError.errorValue);
    }

    return instructionItemsOrError.value;
  }

  static toDomains(entities: InstructionItemEntity[]): InstructionItems[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((counsel) => counsel !== null);
  }

  static toEntity(instructionItems: InstructionItems): InstructionItemEntity {
    const entity = new InstructionItemEntity();

    if (!instructionItems.id.isNewIdentifier()) {
      entity.id = instructionItems.id.getString();
    }

    entity.body = instructionItems.body;

    entity.createdAt = instructionItems.createdAt.toISOString();
    entity.updatedAt = instructionItems.updatedAt.toISOString();
    entity.deletedAt = instructionItems.deletedAt ? instructionItems.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(instructionItems: InstructionItems[]): InstructionItemEntity[] {
    if (instructionItems.length === 0) {
      return [];
    }

    return instructionItems.map((item) => this.toEntity(item));
  }
}
