import { PsqlKakaoMapper } from "~users/domains/auth-users/infrastructures/mappers/psql.kakao.mapper";
import { Kakao } from "~users/domains/auth-users/models/kakao";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { KakaoEntity } from "~common/system/persistences/entities/users/kakao.entity";

describe("PsqlKakaoMapper", () => {
  const createMockKakaoEntity = () => {
    const entity = new KakaoEntity();
    entity.id = faker.string.uuid();
    entity.authUserId = faker.string.uuid();
    entity.uniqueId = faker.string.numeric(10);
    entity.createdAt = getNowDayjs().toISOString();
    entity.updatedAt = getNowDayjs().toISOString();
    entity.deletedAt = null;
    return entity;
  };

  describe("toEntity", () => {
    it("Kakao 도메인을 KakaoEntity로 변환할 수 있다", () => {
      const authUserId = new UniqueEntityId();
      const uniqueId = faker.string.numeric(10);

      const kakao = Kakao.createNew({
        authUserId,
        uniqueId,
      }).value as Kakao;

      const result = PsqlKakaoMapper.toEntity(kakao);

      expect(result).toBeDefined();
      expect(result.authUserId).toBe(authUserId.getNumber());
      expect(result.uniqueId).toBe(uniqueId);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      expect(result.deletedAt).toBeNull();
    });

    it("기존 ID가 있는 도메인을 변환할 수 있다", () => {
      const mockEntity = createMockKakaoEntity();
      const domain = PsqlKakaoMapper.toDomain(mockEntity);
      const result = PsqlKakaoMapper.toEntity(domain);

      expect(result.id).toBe(mockEntity.id);
    });

    it("삭제된 도메인을 변환할 수 있다", () => {
      const authUserId = new UniqueEntityId();
      const uniqueId = faker.string.numeric(10);

      const kakao = Kakao.createNew({
        authUserId,
        uniqueId,
      }).value as Kakao;

      kakao.delete();
      const result = PsqlKakaoMapper.toEntity(kakao);

      expect(result.deletedAt).toBeDefined();
    });
  });

  describe("양방향 변환", () => {
    it("Entity -> Domain -> Entity 변환이 일관성있게 동작한다", () => {
      const originalEntity = createMockKakaoEntity();
      const domain = PsqlKakaoMapper.toDomain(originalEntity);
      const resultEntity = PsqlKakaoMapper.toEntity(domain);

      expect(resultEntity.id).toBe(originalEntity.id);
      expect(resultEntity.authUserId).toBe(originalEntity.authUserId);
      expect(resultEntity.uniqueId).toBe(originalEntity.uniqueId);
      expect(resultEntity.createdAt).toBe(originalEntity.createdAt);
      expect(resultEntity.updatedAt).toBe(originalEntity.updatedAt);
      expect(resultEntity.deletedAt).toBe(originalEntity.deletedAt);
    });

    it("Domain -> Entity -> Domain 변환이 일관성있게 동작한다", () => {
      const originalDomain = Kakao.createNew({
        authUserId: new UniqueEntityId(),
        uniqueId: faker.string.numeric(10),
      }).value as Kakao;

      const entity = PsqlKakaoMapper.toEntity(originalDomain);
      const resultDomain = PsqlKakaoMapper.toDomain(entity);

      expect(resultDomain?.authUserId?.equals(originalDomain.authUserId)).toBeTruthy();
      expect(resultDomain?.uniqueId).toBe(originalDomain.uniqueId);
      expect(resultDomain?.createdAt).toBe(originalDomain.createdAt);
      expect(resultDomain?.updatedAt).toBe(originalDomain.updatedAt);
      expect(resultDomain?.deletedAt).toBe(originalDomain.deletedAt);
    });
  });
});
