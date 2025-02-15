import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { UserProfiles } from "~users/aggregates/users/domain/UserProfiles";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";
import { Users } from "~users/aggregates/users/domain/Users";
import {
  User,
  UserProfile,
  UserProfileSchema,
  UserProgress,
  UserProgressSchema,
  UserSchema,
} from "~proto/com/hearlers/v1/model/user_pb";

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
      userProfile: user.userProfile ? this.toUserProfileProto(user.userProfile) : null,
      userProgresses: user.userProgresses ? user.userProgresses.map(this.toUserProgressProto) : null,
      createdAt: formatDayjsToUtcString(user.createdAt),
      updatedAt: formatDayjsToUtcString(user.updatedAt),
      deletedAt: user.deletedAt ? formatDayjsToUtcString(user.deletedAt) : null,
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
      birthday: userProfile.birthday ? formatDayjsToUtcString(userProfile.birthday) : null,
      introduction: userProfile.introduction,
      createdAt: formatDayjsToUtcString(userProfile.createdAt),
      updatedAt: formatDayjsToUtcString(userProfile.updatedAt),
      deletedAt: userProfile.deletedAt ? formatDayjsToUtcString(userProfile.deletedAt) : null,
    });
  }

  static toUserProgressProto(userProgress: UserProgresses): UserProgress {
    if (!userProgress) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to map userProgress to proto");
    }
    return create(UserProgressSchema, {
      status: userProgress.status,
      progressType: userProgress.progressType,
      lastUpdated: formatDayjsToUtcString(userProgress.lastUpdated),
      createdAt: formatDayjsToUtcString(userProgress.createdAt),
      updatedAt: formatDayjsToUtcString(userProgress.updatedAt),
      deletedAt: userProgress.deletedAt ? formatDayjsToUtcString(userProgress.deletedAt) : null,
    });
  }
}
