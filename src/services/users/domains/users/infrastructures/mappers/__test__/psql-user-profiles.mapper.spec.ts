import { PsqlUserProfilesMapper } from "~users/domains/users/infrastructures/mappers/psql-user-profile.mapper";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { EntityData } from "~common/shared/utils/orm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import dayjs from "dayjs";

describe("PsqlUserProfilesMapper", () => {
  const createMockUserProfilesEntity = (): UserProfilesEntity => {
    const entity = new UserProfilesEntity();
    const props: EntityData<UserProfilesEntity, "user"> = {
      id: faker.string.uuid(),
      userId: faker.string.uuid(),
      profileImage: faker.image.avatar(),
      phoneNumber: "01012345678",
      gender: Gender.MALE,
      mbti: Mbti.ENFP,
      birthday: getNowDayjs().toISOString(),
      introduction: faker.lorem.paragraph(),
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    Object.assign(entity, props);

    return entity;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserProfilesEntity();
      const domain = PsqlUserProfilesMapper.toDomain(entity);
      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.userId.equals(new UniqueEntityId(entity.userId))).toBe(true);
      expect(domain?.profileImage).toBe(entity.profileImage);
      expect(domain?.phoneNumber).toBe(entity.phoneNumber);
      expect(domain?.gender).toBe(entity.gender);
      expect(domain?.mbti).toBe(entity.mbti);
      expect(dayjs(domain?.birthday).isSame(entity.birthday)).toBe(true);
      expect(domain?.introduction).toBe(entity.introduction);
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      const domain = PsqlUserProfilesMapper.toDomain(null as any);
      expect(domain).toBeNull();
    });

    it("유효하지 않은 전화번호로 변환을 시도하면 에러를 던진다", () => {
      const entity = createMockUserProfilesEntity();
      entity.phoneNumber = "invalid-phone";

      expect(() => PsqlUserProfilesMapper.toDomain(entity)).toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      const userProfiles = UserProfiles.createNew({
        userId: new UserId(faker.number.int()),
        profileImage: faker.image.avatar(),
        phoneNumber: "01012345678",
        gender: Gender.MALE,
        mbti: Mbti.ENFP,
        birthday: getNowDayjs(),
        introduction: faker.lorem.paragraph(),
      }).value;

      const entity = PsqlUserProfilesMapper.toEntity(userProfiles);

      expect(entity).toBeDefined();
      expect(entity.profileImage).toBe(userProfiles.profileImage);
      expect(entity.phoneNumber).toBe(userProfiles.phoneNumber);
      expect(entity.gender).toBe(userProfiles.gender);
      expect(entity.mbti).toBe(userProfiles.mbti);
      expect(dayjs(entity.birthday).isSame(userProfiles.birthday)).toBe(true);
      expect(entity.introduction).toBe(userProfiles.introduction);
    });
  });
});
