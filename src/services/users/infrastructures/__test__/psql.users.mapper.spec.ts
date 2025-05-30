import { UserProgressesEntity } from "~shared/core/infrastructure/entities/users/UserProgresses.entity";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { UserProgresses } from "~users/domains/users/models/UserProgresses";
import { Users } from "~users/domains/users/models/users-";
import { PsqlUsersMapper } from "~users/infrastructures/users/mappers/psql.user.mapper";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";
import { ProgressStatus, ProgressType } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { convertDayjs, formatDayjs, getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserMessageTokensEntity } from "~common/system/persistences/entities/users/UserMessageTokens.entity";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/UserProfiles.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/Users.entity";

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
