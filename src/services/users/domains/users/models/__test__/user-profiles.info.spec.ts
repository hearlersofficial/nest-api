import { UserProfilesInfo } from "~users/domains/users/models/user-profiles.info";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { convertDayjs, getNowDayjs } from "~common/shared/utils/date";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

describe("UserProfilesInfo", () => {
  const createUserProfile = () => {
    const props = {
      userId: new UniqueEntityId(),
      profileImage: faker.image.avatar(),
      phoneNumber: "01012345678",
      gender: Gender.MALE,
      mbti: Mbti.ENTP,
      birthday: convertDayjs("1990-01-01"),
      introduction: faker.lorem.paragraph(),
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return UserProfiles.create(props, new UniqueEntityId()).value as UserProfiles;
  };

  describe("fromDomain", () => {
    it("UserProfiles 도메인 객체로부터 UserProfilesInfo를 생성할 수 있다", () => {
      const userProfile = createUserProfile();
      const userProfileInfo = UserProfilesInfo.fromDomain(userProfile);

      expect(userProfileInfo.id).toBe(userProfile.id.getString());
      expect(userProfileInfo.userId).toBe(userProfile.userId.getString());
      expect(userProfileInfo.phoneNumber).toBe(userProfile.phoneNumber);
      expect(userProfileInfo.gender).toBe(userProfile.gender);
      expect(userProfileInfo.mbti).toBe(userProfile.mbti);
    });
  });

  describe("fromDomainArray", () => {
    it("UserProfiles 도메인 객체 배열로부터 UserProfilesInfo 배열을 생성할 수 있다", () => {
      const userProfiles = [createUserProfile(), createUserProfile()];
      const userProfileInfos = UserProfilesInfo.fromDomainArray(userProfiles);

      expect(userProfileInfos).toHaveLength(2);
      expect(userProfileInfos[0].id).toBe(userProfiles[0].id.getString());
      expect(userProfileInfos[1].id).toBe(userProfiles[1].id.getString());
    });
  });
});
