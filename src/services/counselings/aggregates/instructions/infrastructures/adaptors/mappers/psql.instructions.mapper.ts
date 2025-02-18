import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Instructions, InstructionsProps } from "~counselings/aggregates/instructions/domain/instructions";
import { PsqlInstructionMapsMapper } from "~counselings/aggregates/instructions/infrastructures/adaptors/mappers/psql.instructionMaps.mapper";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlInstructionsMapper {
  static toDomain(entity: InstructionEntity): Instructions | null {
    if (!entity) {
      return null;
    }

    const instructionProps: InstructionsProps = {
      initialSentence: entity.initialSentence,
      instructionMaps: entity.instructionMaps
        .sort((a, b) => a.sequence - b.sequence) // 항상 sequence 순서대로 정렬
        .map((instructionMap) => PsqlInstructionMapsMapper.toDomain(instructionMap)),
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const instructionsOrError = Instructions.create(instructionProps, new UniqueEntityId(entity.id));

    if (instructionsOrError.isFailure) {
      throw new InternalServerErrorException(instructionsOrError.errorValue);
    }

    return instructionsOrError.value;
  }

  static toEntity(instructions: Instructions): InstructionEntity {
    const entity = new InstructionEntity();

    if (!instructions.id.isNewIdentifier()) {
      entity.id = instructions.id.getString();
    }

    entity.initialSentence = instructions.initialSentence;
    entity.instructionMaps = instructions.instructionMaps.map((instructionMap) => PsqlInstructionMapsMapper.toEntity(instructionMap));

    entity.createdAt = formatDayjsToUtcString(instructions.createdAt);
    entity.updatedAt = formatDayjsToUtcString(instructions.updatedAt);
    entity.deletedAt = instructions.deletedAt ? formatDayjsToUtcString(instructions.deletedAt) : null;

    return entity;
  }
}
