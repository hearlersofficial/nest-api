import { PsqlUserTrackingsMapper } from "~users/domains/users/infrastructures/mappers/psql-user-trackings.mapper";
import { UserTrackings } from "~users/domains/users/models/user-trackings";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { EntityData } from "~common/shared/utils/orm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UserTrackingsEntity } from "~common/system/persistences/entities/users/user-trackings.entity";
import dayjs from "dayjs";

describe("PsqlUserTrackingsMapper", () => {
  const createMockUserTrackingsEntity = (): UserTrackingsEntity => {
    const entity = new UserTrackingsEntity();
    const props: EntityData<UserTrackingsEntity, "user"> = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      hasSeenIntroCutscene: faker.datatype.boolean(),
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    Object.assign(entity, props);

    return entity;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserTrackingsEntity();
      const domain = PsqlUserTrackingsMapper.toDomain(entity);
      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.userId.equals(new UniqueEntityId(entity.userId))).toBe(true);
      expect(domain?.hasSeenIntroCutscene).toBe(entity.hasSeenIntroCutscene);
      expect(dayjs(domain?.createdAt).isSame(entity.createdAt)).toBe(true);
      expect(dayjs(domain?.updatedAt).isSame(entity.updatedAt)).toBe(true);
      expect(domain?.deletedAt).toBeNull();
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      const domain = PsqlUserTrackingsMapper.toDomain(null as any);
      expect(domain).toBeNull();
    });

    it("유효하지 않은 createdAt으로 변환을 시도하면 에러를 던진다", () => {
      const entity = createMockUserTrackingsEntity();
      entity.createdAt = null as any; // createdAt을 null로 설정하여 validation 실패 유도

      expect(() => PsqlUserTrackingsMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });

    it("유효하지 않은 hasSeenIntroCutscene으로 변환을 시도하면 에러를 던진다", () => {
      const entity = createMockUserTrackingsEntity();
      entity.hasSeenIntroCutscene = null as any;

      expect(() => PsqlUserTrackingsMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      const userTrackings = UserTrackings.createNew({
        userId: new UserId(faker.number.int()),
        hasSeenIntroCutscene: faker.datatype.boolean(),
      }).value;

      const entity = PsqlUserTrackingsMapper.toEntity(userTrackings);

      expect(entity).toBeDefined();
      expect(entity.id).toBe(userTrackings.id.getString());
      expect(entity.userId).toBe(userTrackings.userId.getString());
      expect(entity.hasSeenIntroCutscene).toBe(userTrackings.hasSeenIntroCutscene);
      expect(dayjs(entity.createdAt).isSame(userTrackings.createdAt)).toBe(true);
      expect(dayjs(entity.updatedAt).isSame(userTrackings.updatedAt)).toBe(true);
      expect(entity.deletedAt).toBeNull();
    });

    it("deletedAt이 있는 Domain을 Entity로 변환할 수 있다", () => {
      const userTrackings = UserTrackings.createNew({
        userId: new UserId(faker.number.int()),
        hasSeenIntroCutscene: faker.datatype.boolean(),
      }).value;

      userTrackings.delete();

      const entity = PsqlUserTrackingsMapper.toEntity(userTrackings);

      expect(entity).toBeDefined();
      expect(entity.deletedAt).not.toBeNull();
      expect(dayjs(entity.deletedAt).isSame(userTrackings.deletedAt)).toBe(true);
    });
  });
});
