import { PsqlUsersMapper } from "~users/domains/users/infrastructures/mappers/psql.user.mapper";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Users } from "~users/domains/users/models/users";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/UserMessageTokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/UserProfiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/Users.entity";

describe("PsqlUsersMapper", () => {
  const createMockUserEntity = () => {
    const entity = new UsersEntity();
    entity.id = faker.string.uuid();
    entity.nickname = faker.internet.userName().slice(0, 10);
    entity.userMessageTokens = createMockUserMessageTokensEntity();
    entity.createdAt = getNowDayjs().toISOString();
    entity.updatedAt = getNowDayjs().toISOString();
    entity.deletedAt = null;
    return entity;
  };

  const createMockUserMessageTokensEntity = () => {
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

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserEntity();
      const domain = PsqlUsersMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBeTruthy();
      expect(domain?.nickname).toBe(entity.nickname);
      expect(domain?.userMessageToken).toBeDefined();
    });

    it("관계가 포함된 Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserEntity();

      // Profile 추가
      entity.userProfiles = {
        id: faker.string.uuid(),
        userId: entity.id,
        profileImage: faker.image.avatar(),
        phoneNumber: "01012345678",
        gender: Gender.MALE,
        createdAt: getNowDayjs().toISOString(),
        updatedAt: getNowDayjs().toISOString(),
        deletedAt: null,
      } as UserProfilesEntity;

      const domain = PsqlUsersMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.userProfile).toBeDefined();
      expect(domain?.userMessageToken).toBeDefined();
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      const domain = PsqlUsersMapper.toDomain(null as any);
      expect(domain).toBeNull();
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      const users = Users.createNew({
        nickname: faker.internet.userName().slice(0, 10),
      }).value as Users;

      const entity = PsqlUsersMapper.toEntity(users);

      expect(entity).toBeDefined();
      expect(entity.nickname).toBe(users.nickname);
    });

    it("관계가 포함된 Domain을 Entity로 변환할 수 있다", () => {
      const users = Users.createNew({
        nickname: faker.internet.userName().slice(0, 10),
      }).value;

      // Profile 추가
      const profile = UserProfiles.createNew({
        userId: users.id,
        profileImage: faker.image.avatar(),
        phoneNumber: "01012345678",
        gender: Gender.MALE,
        mbti: Mbti.ENFP,
        birthday: getNowDayjs(),
        introduction: faker.lorem.paragraph(),
      }).value;
      users.userProfile?.updateProfile(profile);

      const entity = PsqlUsersMapper.toEntity(users);

      expect(entity).toBeDefined();
      expect(entity.userProfiles).toBeDefined();
    });
  });
});
