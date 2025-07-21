import { UserMessageTokensInfo } from "~users/domains/users/models/user-message-tokens.info";
import { UserProfilesInfo } from "~users/domains/users/models/user-profiles.info";
import { Users } from "~users/domains/users/models/users";

import { Dayjs } from "dayjs";

export class UsersInfo {
  constructor(
    public readonly id: string,
    public readonly nickname: string,
    public readonly userProfile: UserProfilesInfo,
    public readonly userMessageToken: UserMessageTokensInfo,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(user: Users): UsersInfo {
    return new UsersInfo(
      user.id.getString(),
      user.nickname,
      UserProfilesInfo.fromDomain(user.userProfile),
      UserMessageTokensInfo.fromDomain(user.userMessageToken),
      user.createdAt,
      user.updatedAt,
      user.deletedAt,
    );
  }

  static fromDomainArray(users: Users[]): UsersInfo[] {
    return users.map((user) => UsersInfo.fromDomain(user));
  }
}
