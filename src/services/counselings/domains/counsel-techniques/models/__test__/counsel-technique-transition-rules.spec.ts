import {
  CounselTechniqueTransitionRules,
  CounselTechniqueTransitionRulesNewProps,
  CounselTechniqueTransitionRulesProps,
} from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
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

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

describe("CounselTechniqueTransitionRules", () => {
  const getRandomEnumValues = <T>(enumObject: any, count: number = 2): T[] => {
    const values = Object.values(enumObject).filter((value) => typeof value === "number" && value !== 0);
    return faker.helpers.arrayElements(values, { min: 1, max: Math.min(count, values.length) }) as T[];
  };

  const createValidProps = (): CounselTechniqueTransitionRulesProps => {
    const fromTechniqueId = new CounselTechniqueId();
    const toTechniqueId = new CounselTechniqueId();

    return {
      promptVersionId: new PromptVersionId(),
      fromCounselTechniqueId: fromTechniqueId,
      toCounselTechniqueId: toTechniqueId,
      priority: faker.number.int({ min: 0, max: 100 }),
      minCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 10 }) : null,
      maxCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 11, max: 20 }) : null,
      requiredImpactDomains: getRandomEnumValues<ImpactDomain>(ImpactDomain, 3),
      requiredTimeframes: getRandomEnumValues<Timeframe>(Timeframe, 2),
      requiredEmotionPrimaries: getRandomEnumValues<EmotionPrimary>(EmotionPrimary, 3),
      requiredValences: getRandomEnumValues<Valence>(Valence, 2),
      requiredArousalLevels: getRandomEnumValues<ArousalLevel>(ArousalLevel, 2),
      minEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredPerceivedControls: getRandomEnumValues<PerceivedControl>(PerceivedControl, 2),
      requiredMotivationStages: getRandomEnumValues<MotivationStage>(MotivationStage, 3),
      minSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredSocialSupportLevels: getRandomEnumValues<SocialSupportLevel>(SocialSupportLevel, 2),
      requiredRiskKinds: getRandomEnumValues<RiskKind>(RiskKind, 2),
      minRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 1 }) : null,
      maxRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 2, max: 3 }) : null,
      requiredSleepQualities: getRandomEnumValues<SleepQuality>(SleepQuality, 2),
      requiredPhysicalSymptomsPresent: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      requiredCognitiveLoads: getRandomEnumValues<CognitiveLoad>(CognitiveLoad, 2),
      requiredAllianceStrengths: getRandomEnumValues<AllianceStrength>(AllianceStrength, 2),
      requiredConsentToDepth: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
  };

  const createValidNewProps = (): CounselTechniqueTransitionRulesNewProps => {
    const fromTechniqueId = new CounselTechniqueId();
    const toTechniqueId = new CounselTechniqueId();

    return {
      promptVersionId: new PromptVersionId(),
      fromCounselTechniqueId: fromTechniqueId,
      toCounselTechniqueId: toTechniqueId,
      priority: faker.number.int({ min: 0, max: 100 }),
      minCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 10 }) : null,
      maxCurrentTechniqueMessageCount: faker.datatype.boolean() ? faker.number.int({ min: 11, max: 20 }) : null,
      requiredImpactDomains: getRandomEnumValues<ImpactDomain>(ImpactDomain, 3),
      requiredTimeframes: getRandomEnumValues<Timeframe>(Timeframe, 2),
      requiredEmotionPrimaries: getRandomEnumValues<EmotionPrimary>(EmotionPrimary, 3),
      requiredValences: getRandomEnumValues<Valence>(Valence, 2),
      requiredArousalLevels: getRandomEnumValues<ArousalLevel>(ArousalLevel, 2),
      minEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxEmotionIntensity: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredPerceivedControls: getRandomEnumValues<PerceivedControl>(PerceivedControl, 2),
      requiredMotivationStages: getRandomEnumValues<MotivationStage>(MotivationStage, 3),
      minSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 5 }) : null,
      maxSelfEfficacy: faker.datatype.boolean() ? faker.number.int({ min: 6, max: 10 }) : null,
      requiredSocialSupportLevels: getRandomEnumValues<SocialSupportLevel>(SocialSupportLevel, 2),
      requiredRiskKinds: getRandomEnumValues<RiskKind>(RiskKind, 2),
      minRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 0, max: 1 }) : null,
      maxRiskSeverity: faker.datatype.boolean() ? faker.number.int({ min: 2, max: 3 }) : null,
      requiredSleepQualities: getRandomEnumValues<SleepQuality>(SleepQuality, 2),
      requiredPhysicalSymptomsPresent: faker.datatype.boolean() ? faker.datatype.boolean() : null,
      requiredCognitiveLoads: getRandomEnumValues<CognitiveLoad>(CognitiveLoad, 2),
      requiredAllianceStrengths: getRandomEnumValues<AllianceStrength>(AllianceStrength, 2),
      requiredConsentToDepth: faker.datatype.boolean() ? faker.datatype.boolean() : null,
    };
  };

  describe("create", () => {
    it("유효한 props로 CounselTechniqueTransitionRules를 생성할 수 있다", () => {
      const props = createValidProps();
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(props, id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(CounselTechniqueTransitionRules);
      expect(result.value.id).toEqual(id);
    });

    it("fromCounselTechniqueId가 없으면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        fromCounselTechniqueId: null as any,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("출발 상담 기법 ID는 필수입니다");
    });

    it("toCounselTechniqueId가 없으면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        toCounselTechniqueId: null as any,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("도착 상담 기법 ID는 필수입니다");
    });

    it("출발 기법과 도착 기법이 같으면 실패한다", () => {
      const techniqueId = new CounselTechniqueId();
      const invalidProps = {
        ...createValidProps(),
        fromCounselTechniqueId: techniqueId,
        toCounselTechniqueId: techniqueId,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("출발 기법과 도착 기법은 달라야 합니다");
    });

    it("음수 우선순위로 생성하면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        priority: -1,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("우선순위는 0 이상의 정수여야 합니다");
    });

    it("소수점 우선순위로 생성하면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        priority: 1.5,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("우선순위는 0 이상의 정수여야 합니다");
    });

    it("최소 메시지 수가 최대값보다 크면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        minCurrentTechniqueMessageCount: 10,
        maxCurrentTechniqueMessageCount: 5,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("최소 현 기법 메시지 수는 최대값보다 작거나 같아야 합니다");
    });

    it("감정 강도 범위가 잘못되면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        minEmotionIntensity: 11, // 0-10 범위 초과
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("최소 감정 강도는 0~10 사이여야 합니다");
    });

    it("감정 강도 최소값이 최대값보다 크면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        minEmotionIntensity: 8,
        maxEmotionIntensity: 5,
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("최소 감정 강도는 최대값보다 작거나 같아야 합니다");
    });

    it("자기효능감 범위가 잘못되면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        minSelfEfficacy: 11, // 0-10 범위 초과
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("최소 자기효능감은 0~10 사이여야 합니다");
    });

    it("위험 심각도 범위가 잘못되면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        minRiskSeverity: 4, // 0-3 범위 초과
      };
      const id = new CounselTechniqueTransitionRuleId();
      const result = CounselTechniqueTransitionRules.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("최소 위험 심각도는 0~3 사이여야 합니다");
    });
  });

  describe("createNew", () => {
    it("유효한 newProps로 CounselTechniqueTransitionRules를 생성할 수 있다", () => {
      const newProps = createValidNewProps();
      const result = CounselTechniqueTransitionRules.createNew(newProps);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(CounselTechniqueTransitionRules);
      expect(result.value.id).toBeInstanceOf(CounselTechniqueTransitionRuleId);
      expect(result.value.createdAt).toBeDefined();
      expect(result.value.updatedAt).toBeDefined();
      expect(result.value.deletedAt).toBeNull();
    });

    it("유효하지 않은 newProps로 생성하면 실패한다", () => {
      const invalidNewProps = {
        ...createValidNewProps(),
        fromCounselTechniqueId: null as any,
      };
      const result = CounselTechniqueTransitionRules.createNew(invalidNewProps);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("출발 상담 기법 ID는 필수입니다");
    });
  });

  describe("update", () => {
    let transitionRule: CounselTechniqueTransitionRules;

    beforeEach(() => {
      const props = createValidProps();
      const id = new CounselTechniqueTransitionRuleId();
      transitionRule = CounselTechniqueTransitionRules.create(props, id).value as CounselTechniqueTransitionRules;
    });

    it("유효한 업데이트를 수행할 수 있다", () => {
      const newPriority = faker.number.int({ min: 0, max: 100 });
      const newMinMessageCount = faker.number.int({ min: 1, max: 5 });
      const newMaxMessageCount = faker.number.int({ min: 6, max: 10 });
      const newMinEmotionIntensity = faker.number.int({ min: 0, max: 5 });
      const newMaxEmotionIntensity = faker.number.int({ min: 6, max: 10 });

      transitionRule.update({
        priority: newPriority,
        minCurrentTechniqueMessageCount: newMinMessageCount,
        maxCurrentTechniqueMessageCount: newMaxMessageCount,
        minEmotionIntensity: newMinEmotionIntensity,
        maxEmotionIntensity: newMaxEmotionIntensity,
      });

      expect(transitionRule.priority).toBe(newPriority);
      expect(transitionRule.minCurrentTechniqueMessageCount).toBe(newMinMessageCount);
      expect(transitionRule.maxCurrentTechniqueMessageCount).toBe(newMaxMessageCount);
      expect(transitionRule.minEmotionIntensity).toBe(newMinEmotionIntensity);
      expect(transitionRule.maxEmotionIntensity).toBe(newMaxEmotionIntensity);
      expect(transitionRule.updatedAt).toBeDefined();
    });

    it("일부 속성만 업데이트할 수 있다", () => {
      const newPriority = faker.number.int({ min: 0, max: 100 });
      const originalMinMessageCount = transitionRule.minCurrentTechniqueMessageCount;

      transitionRule.update({
        priority: newPriority,
      });

      expect(transitionRule.priority).toBe(newPriority);
      expect(transitionRule.minCurrentTechniqueMessageCount).toBe(originalMinMessageCount);
    });

    it("null 값으로 업데이트할 수 있다", () => {
      transitionRule.update({
        minCurrentTechniqueMessageCount: null,
        maxCurrentTechniqueMessageCount: null,
      });

      expect(transitionRule.minCurrentTechniqueMessageCount).toBeNull();
      expect(transitionRule.maxCurrentTechniqueMessageCount).toBeNull();
    });
  });

  describe("delete", () => {
    let transitionRule: CounselTechniqueTransitionRules;

    beforeEach(() => {
      const props = createValidProps();
      const id = new CounselTechniqueTransitionRuleId();
      transitionRule = CounselTechniqueTransitionRules.create(props, id).value as CounselTechniqueTransitionRules;
    });

    it("삭제할 수 있다", () => {
      expect(transitionRule.deletedAt).toBeNull();

      transitionRule.delete();

      expect(transitionRule.deletedAt).toBeDefined();
      expect(transitionRule.updatedAt).toBeDefined();
    });
  });

  describe("getters", () => {
    let transitionRule: CounselTechniqueTransitionRules;
    let props: CounselTechniqueTransitionRulesProps;

    beforeEach(() => {
      props = createValidProps();
      const id = new CounselTechniqueTransitionRuleId();
      transitionRule = CounselTechniqueTransitionRules.create(props, id).value as CounselTechniqueTransitionRules;
    });

    it("모든 getter가 올바른 값을 반환한다", () => {
      expect(transitionRule.promptVersionId).toEqual(props.promptVersionId);
      expect(transitionRule.fromCounselTechniqueId).toEqual(props.fromCounselTechniqueId);
      expect(transitionRule.toCounselTechniqueId).toEqual(props.toCounselTechniqueId);
      expect(transitionRule.priority).toBe(props.priority);
      expect(transitionRule.minCurrentTechniqueMessageCount).toBe(props.minCurrentTechniqueMessageCount);
      expect(transitionRule.maxCurrentTechniqueMessageCount).toBe(props.maxCurrentTechniqueMessageCount);
      expect(transitionRule.requiredImpactDomains).toEqual(props.requiredImpactDomains);
      expect(transitionRule.requiredTimeframes).toEqual(props.requiredTimeframes);
      expect(transitionRule.requiredEmotionPrimaries).toEqual(props.requiredEmotionPrimaries);
      expect(transitionRule.requiredValences).toEqual(props.requiredValences);
      expect(transitionRule.requiredArousalLevels).toEqual(props.requiredArousalLevels);
      expect(transitionRule.minEmotionIntensity).toBe(props.minEmotionIntensity);
      expect(transitionRule.maxEmotionIntensity).toBe(props.maxEmotionIntensity);
      expect(transitionRule.requiredPerceivedControls).toEqual(props.requiredPerceivedControls);
      expect(transitionRule.requiredMotivationStages).toEqual(props.requiredMotivationStages);
      expect(transitionRule.minSelfEfficacy).toBe(props.minSelfEfficacy);
      expect(transitionRule.maxSelfEfficacy).toBe(props.maxSelfEfficacy);
      expect(transitionRule.requiredSocialSupportLevels).toEqual(props.requiredSocialSupportLevels);
      expect(transitionRule.requiredRiskKinds).toEqual(props.requiredRiskKinds);
      expect(transitionRule.minRiskSeverity).toBe(props.minRiskSeverity);
      expect(transitionRule.maxRiskSeverity).toBe(props.maxRiskSeverity);
      expect(transitionRule.requiredSleepQualities).toEqual(props.requiredSleepQualities);
      expect(transitionRule.requiredPhysicalSymptomsPresent).toBe(props.requiredPhysicalSymptomsPresent);
      expect(transitionRule.requiredCognitiveLoads).toEqual(props.requiredCognitiveLoads);
      expect(transitionRule.requiredAllianceStrengths).toEqual(props.requiredAllianceStrengths);
      expect(transitionRule.requiredConsentToDepth).toBe(props.requiredConsentToDepth);
      expect(transitionRule.createdAt).toEqual(props.createdAt);
      expect(transitionRule.updatedAt).toEqual(props.updatedAt);
      expect(transitionRule.deletedAt).toBeNull();
    });
  });
});
