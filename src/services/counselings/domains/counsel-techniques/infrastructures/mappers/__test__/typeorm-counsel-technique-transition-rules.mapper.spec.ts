import { TypeormCounselTechniqueTransitionRulesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-technique-transition-rules.mapper";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";

import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { CounselTechniqueTransitionRulesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-technique-transition-rules.helper";

describe("TypeormCounselTechniqueTransitionRulesMapper", () => {
  const createMockEntity = (): CounselTechniqueTransitionRuleEntity => {
    return CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity();
  };

  const createMockEntityWithDeleted = (): CounselTechniqueTransitionRuleEntity => {
    return CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity({
      deletedAt: new Date().toISOString(),
    });
  };

  describe("toDomain", () => {
    it("null을 전달하면 null을 반환한다", () => {
      const result = TypeormCounselTechniqueTransitionRulesMapper.toDomain(null);

      expect(result).toBeNull();
    });

    it("유효한 엔티티를 도메인 객체로 변환한다", () => {
      const entity = createMockEntity();
      const result = TypeormCounselTechniqueTransitionRulesMapper.toDomain(entity);

      expect(result).toBeInstanceOf(CounselTechniqueTransitionRules);
      expect(result.id.getString()).toBe(entity.id);
      expect(result.promptVersionId.getString()).toBe(entity.promptVersionId);
      expect(result.fromCounselTechniqueId.getString()).toBe(entity.fromCounselTechniqueId);
      expect(result.toCounselTechniqueId.getString()).toBe(entity.toCounselTechniqueId);
      expect(result.priority).toBe(entity.priority);
      expect(result.minCurrentTechniqueMessageCount).toBe(entity.minCurrentTechniqueMessageCount);
      expect(result.maxCurrentTechniqueMessageCount).toBe(entity.maxCurrentTechniqueMessageCount);
      expect(result.requiredImpactDomains).toEqual(entity.requiredImpactDomains);
      expect(result.requiredTimeframes).toEqual(entity.requiredTimeframes);
      expect(result.requiredEmotionPrimaries).toEqual(entity.requiredEmotionPrimaries);
      expect(result.requiredValences).toEqual(entity.requiredValences);
      expect(result.requiredArousalLevels).toEqual(entity.requiredArousalLevels);
      expect(result.minEmotionIntensity).toBe(entity.minEmotionIntensity);
      expect(result.maxEmotionIntensity).toBe(entity.maxEmotionIntensity);
      expect(result.requiredPerceivedControls).toEqual(entity.requiredPerceivedControls);
      expect(result.requiredMotivationStages).toEqual(entity.requiredMotivationStages);
      expect(result.minSelfEfficacy).toBe(entity.minSelfEfficacy);
      expect(result.maxSelfEfficacy).toBe(entity.maxSelfEfficacy);
      expect(result.requiredSocialSupportLevels).toEqual(entity.requiredSocialSupportLevels);
      expect(result.requiredRiskKinds).toEqual(entity.requiredRiskKinds);
      expect(result.minRiskSeverity).toBe(entity.minRiskSeverity);
      expect(result.maxRiskSeverity).toBe(entity.maxRiskSeverity);
      expect(result.requiredSleepQualities).toEqual(entity.requiredSleepQualities);
      expect(result.requiredPhysicalSymptomsPresent).toBe(entity.requiredPhysicalSymptomsPresent);
      expect(result.requiredCognitiveLoads).toEqual(entity.requiredCognitiveLoads);
      expect(result.requiredAllianceStrengths).toEqual(entity.requiredAllianceStrengths);
      expect(result.requiredConsentToDepth).toBe(entity.requiredConsentToDepth);
      expect(result.createdAt.toISOString()).toBe(entity.createdAt);
      expect(result.updatedAt.toISOString()).toBe(entity.updatedAt);
      expect(result.deletedAt).toBeNull();
    });

    it("deletedAt이 있는 엔티티를 도메인 객체로 변환한다", () => {
      const entity = createMockEntityWithDeleted();
      const result = TypeormCounselTechniqueTransitionRulesMapper.toDomain(entity);

      expect(result).toBeInstanceOf(CounselTechniqueTransitionRules);
      expect(result.deletedAt?.toISOString()).toBe(entity.deletedAt);
    });

    it("도메인 생성에 실패하면 HttpStatusBasedRpcException을 던진다", () => {
      const entity = createMockEntity();
      entity.fromCounselTechniqueId = entity.toCounselTechniqueId; // 같은 ID로 설정하여 유효성 검사 실패

      expect(() => TypeormCounselTechniqueTransitionRulesMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });

    it("도메인 생성 실패 시 올바른 HTTP 상태 코드와 에러 메시지를 포함한다", () => {
      const entity = createMockEntity();
      entity.fromCounselTechniqueId = entity.toCounselTechniqueId; // 같은 ID로 설정하여 유효성 검사 실패

      expect(() => TypeormCounselTechniqueTransitionRulesMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("toDomains", () => {
    it("엔티티 배열을 도메인 객체 배열로 변환한다", () => {
      const entities = [createMockEntity(), createMockEntity()];
      const results = TypeormCounselTechniqueTransitionRulesMapper.toDomains(entities);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CounselTechniqueTransitionRules);
      expect(results[1]).toBeInstanceOf(CounselTechniqueTransitionRules);
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      const results = TypeormCounselTechniqueTransitionRulesMapper.toDomains([]);

      expect(results).toEqual([]);
    });

    it("null을 전달하면 예외가 발생한다", () => {
      expect(() => TypeormCounselTechniqueTransitionRulesMapper.toDomains(null as any)).toThrow();
    });

    it("undefined를 전달하면 예외가 발생한다", () => {
      expect(() => TypeormCounselTechniqueTransitionRulesMapper.toDomains(undefined as any)).toThrow();
    });

    it("일부 엔티티가 유효하지 않으면 해당 엔티티에서 예외가 발생한다", () => {
      const validEntity = createMockEntity();
      const invalidEntity = createMockEntity();
      invalidEntity.fromCounselTechniqueId = invalidEntity.toCounselTechniqueId; // 유효하지 않은 데이터

      const entities = [validEntity, invalidEntity];

      expect(() => TypeormCounselTechniqueTransitionRulesMapper.toDomains(entities)).toThrow(
        HttpStatusBasedRpcException,
      );
    });
  });

  describe("toEntity", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      const entity = TypeormCounselTechniqueTransitionRulesMapper.toEntity(domain);

      expect(entity).toBeInstanceOf(CounselTechniqueTransitionRuleEntity);
      expect(entity.id).toBe(domain.id.getString());
      expect(entity.promptVersionId).toBe(domain.promptVersionId.getString());
      expect(entity.fromCounselTechniqueId).toBe(domain.fromCounselTechniqueId.getString());
      expect(entity.toCounselTechniqueId).toBe(domain.toCounselTechniqueId.getString());
      expect(entity.priority).toBe(domain.priority);
      expect(entity.minCurrentTechniqueMessageCount).toBe(domain.minCurrentTechniqueMessageCount);
      expect(entity.maxCurrentTechniqueMessageCount).toBe(domain.maxCurrentTechniqueMessageCount);
      expect(entity.requiredImpactDomains).toEqual(domain.requiredImpactDomains);
      expect(entity.requiredTimeframes).toEqual(domain.requiredTimeframes);
      expect(entity.requiredEmotionPrimaries).toEqual(domain.requiredEmotionPrimaries);
      expect(entity.requiredValences).toEqual(domain.requiredValences);
      expect(entity.requiredArousalLevels).toEqual(domain.requiredArousalLevels);
      expect(entity.minEmotionIntensity).toBe(domain.minEmotionIntensity);
      expect(entity.maxEmotionIntensity).toBe(domain.maxEmotionIntensity);
      expect(entity.requiredPerceivedControls).toEqual(domain.requiredPerceivedControls);
      expect(entity.requiredMotivationStages).toEqual(domain.requiredMotivationStages);
      expect(entity.minSelfEfficacy).toBe(domain.minSelfEfficacy);
      expect(entity.maxSelfEfficacy).toBe(domain.maxSelfEfficacy);
      expect(entity.requiredSocialSupportLevels).toEqual(domain.requiredSocialSupportLevels);
      expect(entity.requiredRiskKinds).toEqual(domain.requiredRiskKinds);
      expect(entity.minRiskSeverity).toBe(domain.minRiskSeverity);
      expect(entity.maxRiskSeverity).toBe(domain.maxRiskSeverity);
      expect(entity.requiredSleepQualities).toEqual(domain.requiredSleepQualities);
      expect(entity.requiredPhysicalSymptomsPresent).toBe(domain.requiredPhysicalSymptomsPresent);
      expect(entity.requiredCognitiveLoads).toEqual(domain.requiredCognitiveLoads);
      expect(entity.requiredAllianceStrengths).toEqual(domain.requiredAllianceStrengths);
      expect(entity.requiredConsentToDepth).toBe(domain.requiredConsentToDepth);
      expect(entity.createdAt).toBe(domain.createdAt.toISOString());
      expect(entity.updatedAt).toBe(domain.updatedAt.toISOString());
      expect(entity.deletedAt).toBeNull();
    });

    it("deletedAt이 있는 도메인 객체를 엔티티로 변환한다", () => {
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      domain.delete(); // 삭제 상태로 만들기

      const entity = TypeormCounselTechniqueTransitionRulesMapper.toEntity(domain);

      expect(entity.deletedAt).toBe(domain.deletedAt?.toISOString());
    });

    it("모든 필드가 올바르게 매핑된다", () => {
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      const entity = TypeormCounselTechniqueTransitionRulesMapper.toEntity(domain);

      // 모든 필드가 올바르게 매핑되었는지 확인
      expect(entity.id).toBeDefined();
      expect(entity.promptVersionId).toBeDefined();
      expect(entity.fromCounselTechniqueId).toBeDefined();
      expect(entity.toCounselTechniqueId).toBeDefined();
      expect(entity.priority).toBeDefined();
      expect(entity.requiredImpactDomains).toBeDefined();
      expect(entity.requiredTimeframes).toBeDefined();
      expect(entity.requiredEmotionPrimaries).toBeDefined();
      expect(entity.requiredValences).toBeDefined();
      expect(entity.requiredArousalLevels).toBeDefined();
      expect(entity.requiredPerceivedControls).toBeDefined();
      expect(entity.requiredMotivationStages).toBeDefined();
      expect(entity.requiredSocialSupportLevels).toBeDefined();
      expect(entity.requiredRiskKinds).toBeDefined();
      expect(entity.requiredSleepQualities).toBeDefined();
      expect(entity.requiredCognitiveLoads).toBeDefined();
      expect(entity.requiredAllianceStrengths).toBeDefined();
      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
    });
  });

  describe("toEntities", () => {
    it("도메인 객체 배열을 엔티티 배열로 변환한다", () => {
      const domains = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);
      const entities = TypeormCounselTechniqueTransitionRulesMapper.toEntities(domains);

      expect(entities).toHaveLength(3);
      expect(entities[0]).toBeInstanceOf(CounselTechniqueTransitionRuleEntity);
      expect(entities[1]).toBeInstanceOf(CounselTechniqueTransitionRuleEntity);
      expect(entities[2]).toBeInstanceOf(CounselTechniqueTransitionRuleEntity);
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniqueTransitionRulesMapper.toEntities([]);

      expect(entities).toEqual([]);
    });

    it("null을 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniqueTransitionRulesMapper.toEntities(null as any);

      expect(entities).toEqual([]);
    });

    it("undefined를 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniqueTransitionRulesMapper.toEntities(undefined as any);

      expect(entities).toEqual([]);
    });

    it("각 도메인 객체가 올바르게 엔티티로 변환된다", () => {
      const domains = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(2);
      const entities = TypeormCounselTechniqueTransitionRulesMapper.toEntities(domains);

      domains.forEach((domain, index) => {
        const entity = entities[index];
        expect(entity.id).toBe(domain.id.getString());
        expect(entity.priority).toBe(domain.priority);
        expect(entity.fromCounselTechniqueId).toBe(domain.fromCounselTechniqueId.getString());
        expect(entity.toCounselTechniqueId).toBe(domain.toCounselTechniqueId.getString());
      });
    });
  });
});
