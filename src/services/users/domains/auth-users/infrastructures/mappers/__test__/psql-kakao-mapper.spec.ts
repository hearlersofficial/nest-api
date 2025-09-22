import { PsqlKakaoMapper } from "~users/domains/auth-users/infrastructures/mappers/typeorm-kakao.mapper";
import { Kakao } from "~users/domains/auth-users/models/kakao";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { KakaoEntity } from "~common/system/persistences/entities/users/kakao.entity";
import dayjs from "dayjs";

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
      const authUserId = new AuthUserId();
      const uniqueId = faker.string.numeric(10);

      const kakao = Kakao.createNew({
        authUserId,
        uniqueId,
      }).value;

      const result = PsqlKakaoMapper.toEntity(kakao);

      expect(result).toBeDefined();
      expect(new AuthUserId(result.authUserId)).toEqual(authUserId);
      expect(result.uniqueId).toEqual(uniqueId);
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
      const authUserId = new AuthUserId();
      const uniqueId = faker.string.numeric(10);

      const kakao = Kakao.createNew({
        authUserId,
        uniqueId,
      }).value;

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

      expect(resultEntity.id).toEqual(originalEntity.id);
      expect(resultEntity.authUserId).toEqual(originalEntity.authUserId);
      expect(resultEntity.uniqueId).toEqual(originalEntity.uniqueId);
      expect(dayjs(resultEntity.createdAt).isSame(originalEntity.createdAt)).toBeTruthy();
      expect(dayjs(resultEntity.updatedAt).isSame(originalEntity.updatedAt)).toBeTruthy();
      expect(resultEntity.deletedAt).toBeNull();
    });

    it("Domain -> Entity -> Domain 변환이 일관성있게 동작한다", () => {
      const originalDomain = Kakao.createNew({
        authUserId: new AuthUserId(),
        uniqueId: faker.string.numeric(10),
      }).value;

      const entity = PsqlKakaoMapper.toEntity(originalDomain);
      const resultDomain = PsqlKakaoMapper.toDomain(entity);

      expect(resultDomain?.authUserId?.equals(originalDomain.authUserId)).toBeTruthy();
      expect(resultDomain?.uniqueId).toEqual(originalDomain.uniqueId);
      expect(resultDomain?.createdAt.isSame(originalDomain.createdAt)).toBeTruthy();
      expect(resultDomain?.updatedAt.isSame(originalDomain.updatedAt)).toBeTruthy();
      expect(resultDomain?.deletedAt).toBeNull();
    });
  });
});
