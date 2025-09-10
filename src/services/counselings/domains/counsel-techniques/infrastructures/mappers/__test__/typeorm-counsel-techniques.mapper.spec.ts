import { TypeormCounselTechniquesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-techniques.mapper";
import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { CounselTechniquesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-techniques.helper";

describe("TypeormCounselTechniquesMapper", () => {
  const createMockEntity = (): CounselTechniquesEntity => {
    return CounselTechniquesHelper.createCounselTechniquesEntity();
  };

  const createMockEntityWithDeleted = (): CounselTechniquesEntity => {
    return CounselTechniquesHelper.createCounselTechniquesEntity({ deletedAt: new Date().toISOString() });
  };

  describe("toDomain", () => {
    it("null을 전달하면 null을 반환한다", () => {
      const result = TypeormCounselTechniquesMapper.toDomain(null);

      expect(result).toBeNull();
    });

    it("유효한 엔티티를 도메인 객체로 변환한다", () => {
      const entity = createMockEntity();
      const result = TypeormCounselTechniquesMapper.toDomain(entity);

      expect(result).toBeInstanceOf(CounselTechniques);
      expect(result.id.getString()).toBe(entity.id);
      expect(result.promptVersionId.getString()).toBe(entity.promptVersionId);
      expect(result.name).toBe(entity.name);
      expect(result.temperature).toBe(entity.temperature);
      expect(result.toneId.getString()).toBe(entity.toneId);
      expect(result.context).toBe(entity.context);
      expect(result.instruction).toBe(entity.instruction);
      expect(result.isStartTechnique).toBe(entity.isStartTechnique);
      expect(result.createdAt.toISOString()).toBe(entity.createdAt);
      expect(result.updatedAt.toISOString()).toBe(entity.updatedAt);
      expect(result.deletedAt).toBeNull();
    });

    it("deletedAt이 있는 엔티티를 도메인 객체로 변환한다", () => {
      const entity = createMockEntityWithDeleted();
      const result = TypeormCounselTechniquesMapper.toDomain(entity);

      expect(result).toBeInstanceOf(CounselTechniques);
      expect(result.deletedAt?.toISOString()).toBe(entity.deletedAt);
    });

    it("도메인 생성에 실패하면 HttpStatusBasedRpcException을 던진다", () => {
      const entity = createMockEntity();
      entity.name = undefined as any; // 유효하지 않은 데이터로 설정

      expect(() => TypeormCounselTechniquesMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });

    it("도메인 생성 실패 시 올바른 HTTP 상태 코드와 에러 메시지를 포함한다", () => {
      const entity = createMockEntity();
      entity.name = undefined as any; // 유효하지 않은 데이터로 설정

      expect(() => TypeormCounselTechniquesMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("toDomains", () => {
    it("엔티티 배열을 도메인 객체 배열로 변환한다", () => {
      const entities = [createMockEntity(), createMockEntity()];
      const results = TypeormCounselTechniquesMapper.toDomains(entities);

      expect(results).toHaveLength(2);
      expect(results[0]).toBeInstanceOf(CounselTechniques);
      expect(results[1]).toBeInstanceOf(CounselTechniques);
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      const results = TypeormCounselTechniquesMapper.toDomains([]);

      expect(results).toEqual([]);
    });

    it("null을 전달하면 빈 배열을 반환한다", () => {
      const results = TypeormCounselTechniquesMapper.toDomains(null as any);

      expect(results).toEqual([]);
    });

    it("undefined를 전달하면 빈 배열을 반환한다", () => {
      const results = TypeormCounselTechniquesMapper.toDomains(undefined as any);

      expect(results).toEqual([]);
    });

    it("일부 엔티티가 유효하지 않으면 해당 엔티티에서 예외가 발생한다", () => {
      const validEntity = createMockEntity();
      const invalidEntity = createMockEntity();
      invalidEntity.name = undefined as any; // 유효하지 않은 데이터

      const entities = [validEntity, invalidEntity];

      expect(() => TypeormCounselTechniquesMapper.toDomains(entities)).toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("toEntity", () => {
    it("도메인 객체를 엔티티로 변환한다", () => {
      const domain = CounselTechniquesHelper.createCounselTechniques();
      const entity = TypeormCounselTechniquesMapper.toEntity(domain);

      expect(entity).toBeInstanceOf(CounselTechniquesEntity);
      expect(entity.id).toBe(domain.id.getString());
      expect(entity.promptVersionId).toBe(domain.promptVersionId.getString());
      expect(entity.name).toBe(domain.name);
      expect(entity.temperature).toBe(domain.temperature);
      expect(entity.toneId).toBe(domain.toneId.getString());
      expect(entity.context).toBe(domain.context);
      expect(entity.instruction).toBe(domain.instruction);
      expect(entity.isStartTechnique).toBe(domain.isStartTechnique);
      expect(entity.createdAt).toBe(domain.createdAt.toISOString());
      expect(entity.updatedAt).toBe(domain.updatedAt.toISOString());
      expect(entity.deletedAt).toBeNull();
    });

    it("deletedAt이 있는 도메인 객체를 엔티티로 변환한다", () => {
      const domain = CounselTechniquesHelper.createCounselTechniques();
      domain.delete(); // 삭제 상태로 만들기

      const entity = TypeormCounselTechniquesMapper.toEntity(domain);

      expect(entity.deletedAt).toBe(domain.deletedAt?.toISOString());
    });

    it("모든 필드가 올바르게 매핑된다", () => {
      const domain = CounselTechniquesHelper.createCounselTechniques();
      const entity = TypeormCounselTechniquesMapper.toEntity(domain);

      // 모든 필드가 올바르게 매핑되었는지 확인
      expect(entity.id).toBeDefined();
      expect(entity.promptVersionId).toBeDefined();
      expect(entity.name).toBeDefined();
      expect(entity.temperature).toBeDefined();
      expect(entity.toneId).toBeDefined();
      expect(entity.context).toBeDefined();
      expect(entity.instruction).toBeDefined();
      expect(entity.isStartTechnique).toBeDefined();
      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
    });
  });

  describe("toEntities", () => {
    it("도메인 객체 배열을 엔티티 배열로 변환한다", () => {
      const domains = CounselTechniquesHelper.createCounselTechniquesArray(3);
      const entities = TypeormCounselTechniquesMapper.toEntities(domains);

      expect(entities).toHaveLength(3);
      expect(entities[0]).toBeInstanceOf(CounselTechniquesEntity);
      expect(entities[1]).toBeInstanceOf(CounselTechniquesEntity);
      expect(entities[2]).toBeInstanceOf(CounselTechniquesEntity);
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniquesMapper.toEntities([]);

      expect(entities).toEqual([]);
    });

    it("null을 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniquesMapper.toEntities(null as any);

      expect(entities).toEqual([]);
    });

    it("undefined를 전달하면 빈 배열을 반환한다", () => {
      const entities = TypeormCounselTechniquesMapper.toEntities(undefined as any);

      expect(entities).toEqual([]);
    });

    it("각 도메인 객체가 올바르게 엔티티로 변환된다", () => {
      const domains = CounselTechniquesHelper.createCounselTechniquesArray(2);
      const entities = TypeormCounselTechniquesMapper.toEntities(domains);

      domains.forEach((domain, index) => {
        const entity = entities[index];
        expect(entity.id).toBe(domain.id.getString());
        expect(entity.name).toBe(domain.name);
        expect(entity.temperature).toBe(domain.temperature);
      });
    });
  });
});
