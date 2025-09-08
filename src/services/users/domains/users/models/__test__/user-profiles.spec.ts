import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { convertDayjs, getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { UserProfileId } from "~common/shared-kernel/identifiers/user-profile.id";

describe("UserProfiles", () => {
  const validPhoneNumber = "01012345678";
  let defaultNewProps: any;
  let defaultProps: any;
  let userId: UniqueEntityId;

  beforeEach(() => {
    userId = new UniqueEntityId(faker.number.int());
    const now = getNowDayjs();

    defaultNewProps = {
      userId,
      profileImage: faker.image.avatar(),
      phoneNumber: validPhoneNumber,
      gender: Gender.MALE,
      mbti: Mbti.ENTP,
      birthday: convertDayjs("1990-01-01"),
      introduction: faker.lorem.paragraph(),
    };

    defaultProps = {
      ...defaultNewProps,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
  });

  describe("createNew", () => {
    it("새로운 UserProfile을 생성할 수 있다", () => {
      const result = UserProfiles.createNew(defaultNewProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const profile = result.value;
        expect(profile.userId.equals(userId)).toBe(true);
        expect(profile.phoneNumber).toBe(validPhoneNumber);
        expect(profile.gender).toBe(Gender.MALE);
      }
    });

    it("필수 값이 없으면 생성에 실패한다", () => {
      const result = UserProfiles.createNew({
        ...defaultNewProps,
        profileImage: undefined,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProfiles] 프로필 이미지는 필수입니다");
    });

    it("유효하지 않은 전화번호로 생성하면 실패한다", () => {
      const result = UserProfiles.createNew({
        ...defaultNewProps,
        phoneNumber: "invalid-phone",
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProfiles] 유효하지 않은 전화번호 형식입니다");
    });
  });

  describe("create", () => {
    it("기존 데이터로 UserProfile을 생성할 수 있다", () => {
      const result = UserProfiles.create(defaultProps, new UserProfileId(1));

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const profile = result.value;
        expect(profile.userId.equals(userId)).toBe(true);
        expect(profile.phoneNumber).toBe(validPhoneNumber);
        expect(profile.gender).toBe(Gender.MALE);
      }
    });
  });

  describe("updateProfile", () => {
    let profile: UserProfiles;

    beforeEach(() => {
      profile = UserProfiles.createNew(defaultNewProps).value as UserProfiles;
    });

    it("프로필 정보를 업데이트할 수 있다", () => {
      const newPhoneNumber = "01087654321";
      const newIntroduction = faker.lorem.paragraph();

      const result = profile.updateProfile({
        phoneNumber: newPhoneNumber,
        introduction: newIntroduction,
      });

      expect(result.isSuccess).toBe(true);
      expect(profile.phoneNumber).toBe(newPhoneNumber);
      expect(profile.introduction).toBe(newIntroduction);
    });

    it("유효하지 않은 전화번호로 업데이트하면 실패한다", () => {
      const result = profile.updateProfile({
        phoneNumber: "invalid-phone",
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProfiles] 유효하지 않은 전화번호 형식입니다");
      expect(profile.phoneNumber).toBe(validPhoneNumber);
    });

    it("자기소개가 500자를 초과하면 업데이트에 실패한다", () => {
      const result = profile.updateProfile({
        introduction: "a".repeat(501),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProfiles] 자기소개는 500자를 초과할 수 없습니다");
      expect(profile.introduction).toBe(defaultNewProps.introduction);
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const profile = UserProfiles.createNew(defaultNewProps).value as UserProfiles;

      expect(profile.deletedAt).toBeNull();

      profile.delete();
      expect(profile.deletedAt).not.toBeNull();

      profile.restore();
      expect(profile.deletedAt).toBeNull();
    });
  });

  describe("validateDomain", () => {
    it("유효하지 않은 gender면 실패한다", () => {
      const result = UserProfiles.create(
        {
          ...defaultProps,
          gender: "INVALID_GENDER" as unknown as Gender,
        },
        new UserProfileId(1),
      );

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserProfiles] 유효하지 않은 성별입니다");
    });
  });
});
