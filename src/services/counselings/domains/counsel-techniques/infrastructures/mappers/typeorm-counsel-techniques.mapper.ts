import {
  CounselTechniques,
  CounselTechniquesProps,
} from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatus } from "@nestjs/common";
import { EntityData } from "~common/shared/utils/orm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import dayjs from "dayjs";

export class TypeormCounselTechniquesMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselTechniquesEntity): CounselTechniques;
  static toDomain(entity: CounselTechniquesEntity | null): CounselTechniques | null;
  static toDomain(entity: CounselTechniquesEntity | null): CounselTechniques | null {
    if (!entity) {
      return null;
    }

    const counselTechniqueProps: CounselTechniquesProps = {
      promptVersionId: new PromptVersionId(entity.promptVersionId),
      name: entity.name,
      temperature: entity.temperature,
      toneId: new ToneId(entity.toneId),
      context: entity.context,
      instruction: entity.instruction,
      messageThreshold: entity.messageThreshold,
      isStartTechnique: entity.isStartTechnique,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };
    const counselTechniquesOrError = CounselTechniques.create(counselTechniqueProps, new CounselTechniqueId(entity.id));

    if (counselTechniquesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselTechniquesOrError.errorValue);
    }

    return counselTechniquesOrError.value;
  }

  static toDomains(entities: CounselTechniquesEntity[]): CounselTechniques[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counselTechniques: CounselTechniques): CounselTechniquesEntity {
    const entity = new CounselTechniquesEntity();

    const mappedFields: EntityData<
      CounselTechniquesEntity,
      "tone" | "promptVersion" | "counsels" | "fromTransitionRules" | "toTransitionRules"
    > = {
      id: counselTechniques.id.getString(),
      promptVersionId: counselTechniques.promptVersionId.getString(),
      name: counselTechniques.name,
      temperature: counselTechniques.temperature,
      toneId: counselTechniques.toneId.getString(),
      context: counselTechniques.context,
      instruction: counselTechniques.instruction,
      messageThreshold: counselTechniques.messageThreshold,
      isStartTechnique: counselTechniques.isStartTechnique,
      createdAt: counselTechniques.createdAt.toISOString(),
      updatedAt: counselTechniques.updatedAt.toISOString(),
      deletedAt: counselTechniques.deletedAt ? counselTechniques.deletedAt.toISOString() : null,
    };

    Object.assign(entity, mappedFields);

    return entity;
  }

  static toEntities(counselTechniques: CounselTechniques[]): CounselTechniquesEntity[] {
    return (counselTechniques ?? []).map((counsel) => this.toEntity(counsel));
  }
}
