import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { Dayjs } from "dayjs";

export class UserProfilesInfo {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly profileImage: string,
    public readonly phoneNumber: string,
    public readonly gender: Gender,
    public readonly mbti: Mbti,
    public readonly birthday: Dayjs,
    public readonly introduction: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(userProfile: UserProfiles): UserProfilesInfo {
    return new UserProfilesInfo(
      userProfile.id.getString(),
      userProfile.userId.getString(),
      userProfile.profileImage,
      userProfile.phoneNumber,
      userProfile.gender,
      userProfile.mbti,
      userProfile.birthday,
      userProfile.introduction,
      userProfile.createdAt,
      userProfile.updatedAt,
      userProfile.deletedAt,
    );
  }

  static fromDomainArray(userProfiles: UserProfiles[]): UserProfilesInfo[] {
    return userProfiles.map((profile) => UserProfilesInfo.fromDomain(profile));
  }
}
