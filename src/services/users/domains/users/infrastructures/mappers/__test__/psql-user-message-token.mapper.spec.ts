import { PsqlUserMessageTokensMapper } from "~users/domains/users/infrastructures/mappers/psql-user-message-token.mapper";
import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";

import { faker } from "@faker-js/faker";
import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokenId } from "~common/shared-kernel/identifiers/user-message-token.id";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import dayjs from "dayjs";

describe("PsqlUserMessageTokensMapper", () => {
  const createMockUserMessageTokensEntity = (): UserMessageTokensEntity => {
    const entity = new UserMessageTokensEntity();
    entity.id = faker.string.uuid();
    entity.userId = faker.string.uuid();
    entity.maxTokens = faker.number.int({ min: 1000, max: 10000 });
    entity.remainingTokens = faker.number.int({ min: 0, max: entity.maxTokens });
    entity.reserved = faker.datatype.boolean();
    entity.reservedTimeout = getNowDayjs().add(1, "hour").toISOString();
    entity.resetInterval = faker.helpers.arrayElement(Object.values(TokenResetInterval));
    entity.lastReset = getNowDayjs().toISOString();
    entity.createdAt = getNowDayjs().toISOString();
    entity.updatedAt = getNowDayjs().toISOString();
    entity.deletedAt = null;
    return entity;
  };

  const createMockUserMessageTokens = () => {
    const domain = UserMessageTokens.create(
      {
        userId: new UserId(faker.number.int()),
        maxTokens: faker.number.int({ min: 1000, max: 10000 }),
        remainingTokens: faker.number.int({ min: 0, max: 1000 }),
        reserved: faker.datatype.boolean(),
        reservedTimeout: getNowDayjs().add(1, "hour"),
        resetInterval: faker.helpers.arrayElement(Object.values(TokenResetInterval)),
        lastReset: getNowDayjs(),
        createdAt: getNowDayjs(),
        updatedAt: getNowDayjs(),
        deletedAt: null,
      },
      new UserMessageTokenId(faker.number.int()),
    ).value;
    return domain;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      // given
      const entity = createMockUserMessageTokensEntity();

      // when
      const domain = PsqlUserMessageTokensMapper.toDomain(entity);

      // then
      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.userId.equals(new UniqueEntityId(entity.userId))).toBe(true);
      expect(domain?.maxTokens).toBe(entity.maxTokens);
      expect(domain?.remainingTokens).toBe(entity.remainingTokens);
      expect(domain?.reserved).toBe(entity.reserved);
      expect(domain?.reservedTimeout?.isSame(dayjs(entity.reservedTimeout))).toBe(true);
      expect(domain?.resetInterval).toBe(entity.resetInterval);
      expect(domain?.lastReset.isSame(dayjs(entity.lastReset))).toBe(true);
      expect(domain?.createdAt.isSame(dayjs(entity.createdAt))).toBe(true);
      expect(domain?.updatedAt.isSame(dayjs(entity.updatedAt))).toBe(true);
      expect(domain?.deletedAt).toBeNull();
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      // when
      const domain = PsqlUserMessageTokensMapper.toDomain(null as any);

      // then
      expect(domain).toBeNull();
    });
  });

  describe("toDomains", () => {
    it("Entity 배열을 Domain 배열로 변환할 수 있다", () => {
      // given
      const entities = [createMockUserMessageTokensEntity(), createMockUserMessageTokensEntity()];

      // when
      const domains = PsqlUserMessageTokensMapper.toDomains(entities);

      // then
      expect(domains).toHaveLength(2);
      domains.forEach((domain, index) => {
        expect(domain.id.equals(new UniqueEntityId(entities[index].id))).toBe(true);
      });
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      // when
      const domains = PsqlUserMessageTokensMapper.toDomains([]);

      // then
      expect(domains).toHaveLength(0);
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      // given
      const domain = createMockUserMessageTokens();

      // when
      const convertedEntity = PsqlUserMessageTokensMapper.toEntity(domain!);

      // then
      expect(convertedEntity).toBeDefined();
      expect(convertedEntity.id).toBe(domain.id.getString());
      expect(convertedEntity.userId).toBe(domain.userId.getString());
      expect(convertedEntity.maxTokens).toBe(domain.maxTokens);
      expect(convertedEntity.remainingTokens).toBe(domain.remainingTokens);
      expect(convertedEntity.reserved).toBe(domain.reserved);
      expect(convertedEntity.reservedTimeout).toBe(domain.reservedTimeout?.toISOString());
      expect(convertedEntity.resetInterval).toBe(domain.resetInterval);
      expect(convertedEntity.lastReset).toBe(domain.lastReset.toISOString());
      expect(convertedEntity.createdAt).toBe(domain.createdAt.toISOString());
      expect(convertedEntity.updatedAt).toBe(domain.updatedAt.toISOString());
      expect(convertedEntity.deletedAt).toBeNull();
    });
  });

  describe("toEntities", () => {
    it("Domain 배열을 Entity 배열로 변환할 수 있다", () => {
      // given
      const domains = [createMockUserMessageTokens(), createMockUserMessageTokens()];

      // when
      const convertedEntities = PsqlUserMessageTokensMapper.toEntities(domains);

      // then
      expect(convertedEntities).toHaveLength(2);
      convertedEntities.forEach((entity, index) => {
        expect(entity.id).toBe(domains[index].id.getString());
      });
    });

    it("빈 배열을 전달하면 빈 배열을 반환한다", () => {
      // when
      const entities = PsqlUserMessageTokensMapper.toEntities([]);

      // then
      expect(entities).toHaveLength(0);
    });
  });
});
