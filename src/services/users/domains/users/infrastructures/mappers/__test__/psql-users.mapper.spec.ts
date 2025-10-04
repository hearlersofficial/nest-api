import { PsqlUsersMapper } from "~users/domains/users/infrastructures/mappers/psql.user.mapper";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Users } from "~users/domains/users/models/users";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { CoreStatus } from "~common/shared/enums/status";
import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { EntityData } from "~common/shared/utils/orm";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/user-message-tokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";

describe("PsqlUsersMapper", () => {
  const createMockUserEntity = (): UsersEntity => {
    const entity = new UsersEntity();
    const userId = faker.string.uuid();
    const props: EntityData<UsersEntity, "authUser" | "counsels" | "counselorUserRelationships" | "userTrackings"> = {
      id: userId,
      nickname: faker.internet.userName().slice(0, 10),
      userProfiles: createMockUserProfilesEntity(userId),
      userMessageTokens: createMockUserMessageTokensEntity(userId),
      userActivities: [],
      status: CoreStatus.ACTIVE,
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    Object.assign(entity, props);
    return entity;
  };

  const createMockUserMessageTokensEntity = (userId: string): UserMessageTokensEntity => {
    const maxTokens = faker.number.int({ min: 1000, max: 10000 });
    const props: EntityData<UserMessageTokensEntity, "user"> = {
      id: faker.string.uuid(),
      userId: userId,
      maxTokens: maxTokens,
      remainingTokens: faker.number.int({ min: 0, max: maxTokens }),
      reserved: faker.datatype.boolean(),
      reservedTimeout: getNowDayjs().add(1, "hour").toISOString(),
      resetInterval: faker.helpers.arrayElement(Object.values(TokenResetInterval)),
      lastReset: getNowDayjs().toISOString(),
      createdAt: getNowDayjs().toISOString(),
      updatedAt: getNowDayjs().toISOString(),
      deletedAt: null,
    };
    const entity = new UserMessageTokensEntity();
    Object.assign(entity, props);

    return entity;
  };

  const createMockUserProfilesEntity = (userId: string): UserProfilesEntity => {
    const entity = new UserProfilesEntity();
    const props: EntityData<UserProfilesEntity, "user"> = {
      id: faker.string.uuid(),
      userId: userId,
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
      const entity = createMockUserEntity();
      const domain = PsqlUsersMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UserId(entity.id))).toBeTruthy();
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
      }).value;

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
