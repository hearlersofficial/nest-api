import { Kakao } from "~users/domains/auth-users/models/kakao";
import { PsqlKakaoMapper } from "~users/infrastructures/auth-users/mappers/psql.kakao.mapper";

import { fakerKO as faker } from "@faker-js/faker";
import { InternalServerErrorException } from "@nestjs/common";
import { formatDayjsToUtcString, getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { KakaoEntity } from "~common/system/persistences/entities/users/Kakao.entity";

describe("PsqlKakaoMapper", () => {
  const createMockKakaoEntity = () => {
    const entity = new KakaoEntity();
    entity.id = faker.string.uuid();
    entity.authUserId = faker.string.uuid();
    entity.uniqueId = faker.string.numeric(10);
    entity.createdAt = formatDayjsToUtcString(getNowDayjs());
    entity.updatedAt = formatDayjsToUtcString(getNowDayjs());
    entity.deletedAt = null;
    return entity;
  };

  describe("toDomain", () => {
    it("KakaoEntity를 Kakao 도메인으로 변환할 수 있다", () => {
      const mockEntity = createMockKakaoEntity();
      const result = PsqlKakaoMapper.toDomain(mockEntity);

      expect(result).toBeDefined();
      expect(result?.id.getNumber()).toBe(mockEntity.id);
      expect(result?.authUserId.getNumber()).toBe(mockEntity.authUserId);
      expect(result?.uniqueId).toBe(mockEntity.uniqueId);
      expect(formatDayjsToUtcString(result?.createdAt)).toBe(mockEntity.createdAt);
      expect(formatDayjsToUtcString(result?.updatedAt)).toBe(mockEntity.updatedAt);
      expect(result?.deletedAt).toBeNull();
    });

    it("삭제된 KakaoEntity를 변환할 수 있다", () => {
      const mockEntity = createMockKakaoEntity();
      mockEntity.deletedAt = formatDayjsToUtcString(getNowDayjs());

      const result = PsqlKakaoMapper.toDomain(mockEntity);

      expect(result).toBeDefined();
      expect(formatDayjsToUtcString(result?.deletedAt)).toBe(mockEntity.deletedAt);
    });

    it("entity가 null이면 null을 반환한다", () => {
      const result = PsqlKakaoMapper.toDomain(null);
      expect(result).toBeNull();
    });

    it("유효하지 않은 데이터로 변환을 시도하면 예외가 발생한다", () => {
      const invalidEntity = createMockKakaoEntity();
      invalidEntity.uniqueId = ""; // 유효하지 않은 데이터

      expect(() => PsqlKakaoMapper.toDomain(invalidEntity)).toThrow(InternalServerErrorException);
    });
  });

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

      expect(resultDomain.authUserId.equals(originalDomain.authUserId)).toBeTruthy();
      expect(resultDomain.uniqueId).toBe(originalDomain.uniqueId);
      expect(formatDayjsToUtcString(resultDomain.createdAt)).toBe(originalDomain.createdAt);
      expect(formatDayjsToUtcString(resultDomain.updatedAt)).toBe(originalDomain.updatedAt);
      expect(resultDomain.deletedAt).toBe(originalDomain.deletedAt);
    });
  });
});
