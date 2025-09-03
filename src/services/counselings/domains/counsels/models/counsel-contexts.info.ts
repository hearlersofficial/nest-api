import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import {
  AllianceStrength,
  ArousalLevel,
  CognitiveLoad,
  EmotionPrimary,
  ImpactDomain,
  MotivationStage,
  PerceivedControl,
  RiskKind,
  SleepQuality,
  SocialSupportLevel,
  Timeframe,
  Valence,
} from "~proto/com/hearlers/v1/model/counsel_pb";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselContextId } from "~common/shared-kernel/identifiers/counsel-context.id";
import { Dayjs } from "dayjs";

export class CounselContextsInfo {
  constructor(
    public readonly id: CounselContextId,
    public readonly counselId: CounselId,
    public readonly notCompressedMessageCount: number,
    public readonly lastMessageCompressedAt: Dayjs | null,
    public readonly currentTechniqueMessageCount: number,
    public readonly impactDomain: ImpactDomain,
    public readonly timeframe: Timeframe,
    public readonly emotionPrimary: EmotionPrimary,
    public readonly valence: Valence,
    public readonly arousal: ArousalLevel,
    public readonly perceivedControl: PerceivedControl,
    public readonly motivationStage: MotivationStage,
    public readonly socialSupport: SocialSupportLevel,
    public readonly riskKind: RiskKind,
    public readonly sleepQuality: SleepQuality,
    public readonly cognitiveLoad: CognitiveLoad,
    public readonly allianceStrength: AllianceStrength,
    public readonly riskSeverity: 0 | 1 | 2 | 3 | null,
    public readonly selfEfficacy: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null,
    public readonly emotionIntensity: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | null,
    public readonly physicalSymptomsPresent: boolean | null,
    public readonly consentToDepth: boolean | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(counselContexts: CounselContexts): CounselContextsInfo {
    return new CounselContextsInfo(
      counselContexts.id,
      counselContexts.counselId,
      counselContexts.notCompressedMessageCount,
      counselContexts.lastMessageCompressedAt,
      counselContexts.currentTechniqueMessageCount,
      counselContexts.impactDomain,
      counselContexts.timeframe,
      counselContexts.emotionPrimary,
      counselContexts.valence,
      counselContexts.arousal,
      counselContexts.perceivedControl,
      counselContexts.motivationStage,
      counselContexts.socialSupport,
      counselContexts.riskKind,
      counselContexts.sleepQuality,
      counselContexts.cognitiveLoad,
      counselContexts.allianceStrength,
      counselContexts.riskSeverity,
      counselContexts.selfEfficacy,
      counselContexts.emotionIntensity,
      counselContexts.physicalSymptomsPresent,
      counselContexts.consentToDepth,
      counselContexts.createdAt,
      counselContexts.updatedAt,
      counselContexts.deletedAt,
    );
  }

  static fromDomainArray(counselContextsList: CounselContexts[]): CounselContextsInfo[] {
    return counselContextsList.map((contexts) => CounselContextsInfo.fromDomain(contexts));
  }
}
