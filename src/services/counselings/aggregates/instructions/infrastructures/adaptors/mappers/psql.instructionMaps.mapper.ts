import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { InstructionMaps, InstructionMapsProps } from "~counselings/aggregates/instructions/domain/instructionMaps";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlInstructionMapsMapper {
  static toDomain(entity: InstructionMapEntity): InstructionMaps | null {
    if (!entity) {
      return null;
    }

    const instructionMapProps: InstructionMapsProps = {
      sequence: entity.sequence,
      instructionItemId: new UniqueEntityId(entity.instructionItemId),
      instructionId: new UniqueEntityId(entity.instructionId),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
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

    entity.createdAt = formatDayjsToUtcString(instructionMaps.createdAt);
    entity.updatedAt = formatDayjsToUtcString(instructionMaps.updatedAt);
    entity.deletedAt = instructionMaps.deletedAt ? formatDayjsToUtcString(instructionMaps.deletedAt) : null;

    return entity;
  }
}
