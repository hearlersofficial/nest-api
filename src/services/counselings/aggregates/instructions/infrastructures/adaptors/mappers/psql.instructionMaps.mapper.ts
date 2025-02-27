import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { InstructionMaps, InstructionMapsProps } from "~counselings/aggregates/instructions/domain/instructionMaps";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlInstructionMapsMapper {
  static toDomain(entity: InstructionMapEntity): InstructionMaps | null {
    if (!entity) {
      return null;
    }

    const instructionMapProps: InstructionMapsProps = {
      sequence: entity.sequence,
      instructionItemId: new UniqueEntityId(entity.instructionItemId),
      instructionId: new UniqueEntityId(entity.instructionId),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const instructionMapsOrError = InstructionMaps.create(instructionMapProps, new UniqueEntityId(entity.id));

    if (instructionMapsOrError.isFailure) {
      throw new InternalServerErrorException(instructionMapsOrError.errorValue);
    }

    return instructionMapsOrError.value;
  }

  static toEntity(instructionMaps: InstructionMaps): InstructionMapEntity {
    const entity = new InstructionMapEntity();

    if (!instructionMaps.id.isNewIdentifier()) {
      entity.id = instructionMaps.id.getString();
    }

    entity.sequence = instructionMaps.sequence;
    entity.instructionItemId = instructionMaps.instructionItemId.getString();
    entity.instructionId = instructionMaps.instructionId.getString();

    entity.createdAt = instructionMaps.createdAt.toISOString();
    entity.updatedAt = instructionMaps.updatedAt.toISOString();
    entity.deletedAt = instructionMaps.deletedAt ? instructionMaps.deletedAt.toISOString() : null;

    return entity;
  }
}
