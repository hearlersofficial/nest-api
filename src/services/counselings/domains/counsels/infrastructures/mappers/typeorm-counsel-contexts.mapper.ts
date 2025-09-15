import { CounselContexts, CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";

import { HttpStatus } from "@nestjs/common";
import { convertDayjs } from "~common/shared/utils/date";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselContextId } from "~common/shared-kernel/identifiers/counsel-context.id";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";

export class TypeormCounselContextsMapper {
  static toDomain(entity: null): null;
  static toDomain(entity: CounselContextsEntity): CounselContexts;
  static toDomain(entity: CounselContextsEntity | null): CounselContexts | null;
  static toDomain(entity: CounselContextsEntity | null): CounselContexts | null {
    if (!entity) {
      return null;
    }

    const counselContextsProps: CounselContextsProps = {
      counselId: new CounselId(entity.counselId),
      counselTechniqueId: new CounselTechniqueId(entity.counselTechniqueId),
      messageCountAtLastTransition: entity.messageCountAtLastTransition,
      impactDomain: entity.impactDomain,
      timeframe: entity.timeframe,
      emotionPrimary: entity.emotionPrimary,
      valence: entity.valence,
      arousal: entity.arousal,
      perceivedControl: entity.perceivedControl,
      motivationStage: entity.motivationStage,
      socialSupport: entity.socialSupport,
      riskKind: entity.riskKind,
      sleepQuality: entity.sleepQuality,
      cognitiveLoad: entity.cognitiveLoad,
      allianceStrength: entity.allianceStrength,
      riskSeverity: entity.riskSeverity,
      selfEfficacy: entity.selfEfficacy,
      emotionIntensity: entity.emotionIntensity,
      physicalSymptomsPresent: entity.physicalSymptomsPresent,
      consentToDepth: entity.consentToDepth,
      createdAt: convertDayjs(entity.createdAt),
      updatedAt: convertDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertDayjs(entity.deletedAt) : null,
    };
    const counselsOrError = CounselContexts.create(counselContextsProps, new CounselContextId(entity.id));

    if (counselsOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, counselsOrError.errorValue);
    }

    return counselsOrError.value;
  }

  static toDomains(entities: CounselContextsEntity[]): CounselContexts[] {
    return (entities ?? []).map((entity) => this.toDomain(entity));
  }

  static toEntity(counselContexts: CounselContexts): CounselContextsEntity {
    const entity = new CounselContextsEntity();

    entity.id = counselContexts.id.getString();
    entity.counselId = counselContexts.counselId.getString();
    entity.counselTechniqueId = counselContexts.counselTechniqueId.getString();
    entity.messageCountAtLastTransition = counselContexts.messageCountAtLastTransition;
    entity.impactDomain = counselContexts.impactDomain;
    entity.timeframe = counselContexts.timeframe;
    entity.emotionPrimary = counselContexts.emotionPrimary;
    entity.valence = counselContexts.valence;
    entity.arousal = counselContexts.arousal;
    entity.perceivedControl = counselContexts.perceivedControl;
    entity.motivationStage = counselContexts.motivationStage;
    entity.socialSupport = counselContexts.socialSupport;
    entity.riskKind = counselContexts.riskKind;
    entity.sleepQuality = counselContexts.sleepQuality;
    entity.cognitiveLoad = counselContexts.cognitiveLoad;
    entity.allianceStrength = counselContexts.allianceStrength;
    entity.riskSeverity = counselContexts.riskSeverity;
    entity.selfEfficacy = counselContexts.selfEfficacy;
    entity.emotionIntensity = counselContexts.emotionIntensity;
    entity.physicalSymptomsPresent = counselContexts.physicalSymptomsPresent;
    entity.consentToDepth = counselContexts.consentToDepth;

    entity.createdAt = counselContexts.createdAt.toISOString();
    entity.updatedAt = counselContexts.updatedAt.toISOString();
    entity.deletedAt = counselContexts.deletedAt ? counselContexts.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(counselContexts: CounselContexts[]): CounselContextsEntity[] {
    return (counselContexts ?? []).map((counselContext) => this.toEntity(counselContext));
  }
}
