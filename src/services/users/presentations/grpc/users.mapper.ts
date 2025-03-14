import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { Users } from "~users/domains/users/models/users-domain";
import { User, UserProfile, UserProfileSchema, UserSchema } from "~proto/com/hearlers/v1/model/user_pb";

import { create } from "@bufbuild/protobuf";
import { HttpStatus } from "@nestjs/common";

export class SchemaUsersMapper {
  static toUserProto(user: Users): User {
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

  static toUserProfileProto(userProfile: UserProfiles): UserProfile {
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
