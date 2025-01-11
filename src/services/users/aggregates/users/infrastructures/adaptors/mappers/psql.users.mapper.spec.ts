import { fakerKO as faker } from "@faker-js/faker";
import { Users } from "~users/aggregates/users/domain/Users";
import { UserProfiles } from "~users/aggregates/users/domain/UserProfiles";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";
import { PsqlUsersMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.users.mapper";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";
import { ProgressType, ProgressStatus } from "~proto/com/hearlers/v1/model/user_pb";
import { getNowDayjs, formatDayjs, convertDayjs } from "~shared/utils/Date.utils";
import { UserProgressesEntity } from "~shared/core/infrastructure/entities/UserProgresses.entity";
import { UserProfilesEntity } from "~shared/core/infrastructure/entities/UserProfiles.entity";
import { UserMessageTokensEntity } from "~shared/core/infrastructure/entities/UserMessageTokens.entity";
import { TokenResetInterval } from "~shared/enums/TokenResetInterval.enum";

describe("PsqlUsersMapper", () => {
  const createMockUserEntity = () => {
    const entity = new UsersEntity();
    entity.id = faker.number.int();
    entity.nickname = faker.internet.userName().slice(0, 10);
    entity.userMessageTokens = createMockUserMessageTokensEntity();
    entity.createdAt = formatDayjs(getNowDayjs());
    entity.updatedAt = formatDayjs(getNowDayjs());
    entity.deletedAt = null;
    return entity;
  };

  const createMockUserMessageTokensEntity = () => {
    const entity = new UserMessageTokensEntity();
    entity.id = faker.number.int();
    entity.userId = faker.number.int();
    entity.maxTokens = faker.number.int({ min: 1000, max: 10000 });
    entity.remainingTokens = faker.number.int({ min: 0, max: entity.maxTokens });
    entity.reserved = faker.datatype.boolean();
    entity.reservedTimeout = formatDayjs(getNowDayjs().add(1, "hour"));
    entity.resetInterval = faker.helpers.arrayElement(Object.values(TokenResetInterval));
    entity.lastReset = formatDayjs(getNowDayjs());
    entity.createdAt = formatDayjs(getNowDayjs());
    entity.updatedAt = formatDayjs(getNowDayjs());
    entity.deletedAt = null;
    return entity;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserEntity();
      const domain = PsqlUsersMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.nickname).toBe(entity.nickname);
      expect(domain?.userMessageToken).toBeDefined();
    });

    it("관계가 포함된 Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserEntity();

      // Profile 추가
      entity.userProfiles = {
        id: faker.number.int(),
        userId: entity.id,
        profileImage: faker.image.avatar(),
        phoneNumber: "01012345678",
        gender: Gender.MALE,
        createdAt: formatDayjs(getNowDayjs()),
        updatedAt: formatDayjs(getNowDayjs()),
        deletedAt: null,
      } as UserProfilesEntity;

      // Progress 추가
      entity.userProgresses = [
        {
          id: faker.number.int(),
          status: ProgressStatus.IN_PROGRESS,
          userId: entity.id,
          progressType: ProgressType.ONBOARDING,
          createdAt: formatDayjs(getNowDayjs()),
          updatedAt: formatDayjs(getNowDayjs()),
          deletedAt: null,
        } as UserProgressesEntity,
      ];

      const domain = PsqlUsersMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.userProfile).toBeDefined();
      expect(domain?.userProgresses).toHaveLength(1);
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
        birthday: convertDayjs("1990-01-01"),
        introduction: faker.lorem.paragraph(),
      }).value;
      users.userProfile.updateProfile(profile);

      // Progress 추가
      const progress = UserProgresses.createNew({
        userId: users.id,
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      }).value;
      users.addProgress(progress);

      const entity = PsqlUsersMapper.toEntity(users);

      expect(entity).toBeDefined();
      expect(entity.userProfiles).toBeDefined();
      expect(entity.userProgresses).toHaveLength(1);
    });
  });
});
