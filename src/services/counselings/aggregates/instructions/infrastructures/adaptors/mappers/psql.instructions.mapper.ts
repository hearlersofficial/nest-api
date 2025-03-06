import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { Instructions, InstructionsProps } from "~counselings/aggregates/instructions/domain/instructions";
import { PsqlInstructionMapsMapper } from "~counselings/aggregates/instructions/infrastructures/adaptors/mappers/psql.instructionMaps.mapper";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlInstructionsMapper {
  static toDomain(entity: InstructionEntity): Instructions | null {
    if (!entity) {
      return null;
    }

    const instructionProps: InstructionsProps = {
      name: entity.name,
      initialSentence: entity.initialSentence ?? null,
      instructionMaps: entity.instructionMaps
        .sort((a, b) => a.sequence - b.sequence) // 항상 sequence 순서대로 정렬
        .map((instructionMap) => PsqlInstructionMapsMapper.toDomain(instructionMap))
        .filter((instructionMap) => instructionMap !== null),
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
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

    entity.name = instructions.name;
    entity.initialSentence = instructions.initialSentence ?? null;
    entity.instructionMaps = instructions.instructionMaps.map((instructionMap) =>
      PsqlInstructionMapsMapper.toEntity(instructionMap),
    );

    entity.createdAt = instructions.createdAt.toISOString();
    entity.updatedAt = instructions.updatedAt.toISOString();
    entity.deletedAt = instructions.deletedAt ? instructions.deletedAt.toISOString() : null;

    return entity;
  }
}
