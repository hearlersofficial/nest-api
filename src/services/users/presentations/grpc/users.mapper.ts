import { UsersInfo } from "~users/domains/users/models/user.info";
import { UserProfilesInfo } from "~users/domains/users/models/user-profiles.info";
import { User, UserProfile, UserProfileSchema, UserSchema } from "~proto/com/hearlers/v1/model/user_pb";

import { create } from "@bufbuild/protobuf";
import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

export class SchemaUsersMapper {
  static toUserProto(user: UsersInfo): User {
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map user to proto");
    }
    return create(UserSchema, {
      id: user.id.getString(),
      nickname: user.nickname,
      userProfile: user.userProfile ? this.toUserProfileProto(user.userProfile) : undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      deletedAt: user.deletedAt ? user.deletedAt.toISOString() : undefined,
    });
  }

  static toUserProfileProto(userProfile: UserProfilesInfo): UserProfile {
    if (!userProfile) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map userProfile to proto");
    }
    return create(UserProfileSchema, {
      profileImage: userProfile.profileImage,
      phoneNumber: userProfile.phoneNumber,
      mbti: userProfile.mbti,
      gender: userProfile.gender,
      birthday: userProfile.birthday ? userProfile.birthday.toISOString() : undefined,
      introduction: userProfile.introduction,
      createdAt: userProfile.createdAt.toISOString(),
      updatedAt: userProfile.updatedAt.toISOString(),
      deletedAt: userProfile.deletedAt ? userProfile.deletedAt.toISOString() : undefined,
    });
  }
}
