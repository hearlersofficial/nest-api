import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { UserProfilesInfo } from "~users/domains/users/models/user-profiles.info";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { convertDayjs, getNowDayjs } from "~common/shared/utils/date";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserProfileId } from "~common/shared-kernel/identifiers/user-profile.id";

describe("UserProfilesInfo", () => {
  const createUserProfile = () => {
    const props = {
      userId: new UserId(),
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
    return UserProfiles.create(props, new UserProfileId()).value as UserProfiles;
  };

  describe("fromDomain", () => {
    it("UserProfiles 도메인 객체로부터 UserProfilesInfo를 생성할 수 있다", () => {
      const userProfile = createUserProfile();
      const userProfileInfo = UserProfilesInfo.fromDomain(userProfile);

      expect(userProfileInfo.id).toEqual(userProfile.id);
      expect(userProfileInfo.userId).toEqual(userProfile.userId);
      expect(userProfileInfo.phoneNumber).toEqual(userProfile.phoneNumber);
      expect(userProfileInfo.gender).toBe(userProfile.gender);
      expect(userProfileInfo.mbti).toEqual(userProfile.mbti);
    });
  });

  describe("fromDomainArray", () => {
    it("UserProfiles 도메인 객체 배열로부터 UserProfilesInfo 배열을 생성할 수 있다", () => {
      const userProfiles = [createUserProfile(), createUserProfile()];
      const userProfileInfos = UserProfilesInfo.fromDomainArray(userProfiles);

      expect(userProfileInfos).toHaveLength(2);
      expect(userProfileInfos[0].id).toEqual(userProfiles[0].id);
      expect(userProfileInfos[1].id).toEqual(userProfiles[1].id);
    });
  });
});
