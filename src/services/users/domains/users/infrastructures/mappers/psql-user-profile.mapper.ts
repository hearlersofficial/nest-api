import { UserProfiles } from "~users/domains/users/models/use-profiles";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserProfileId } from "~common/shared-kernel/identifiers/user-profile.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UserProfilesEntity } from "~common/system/persistences/entities/users/user-profiles.entity";
import dayjs from "dayjs";

export class PsqlUserProfilesMapper {
  static toDomain(entity: UserProfilesEntity): UserProfiles | null {
    if (!entity) {
      return null;
    }

    const userProfilesProps = {
      userId: new UserId(entity.userId),
      profileImage: entity.profileImage,
      phoneNumber: entity.phoneNumber,
      gender: entity.gender,
      birthday: dayjs(entity.birthday),
      introduction: entity.introduction,
      mbti: entity.mbti,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
    };

    const userProfilesOrError: Result<UserProfiles> = UserProfiles.create(
      userProfilesProps,
      new UserProfileId(entity.id),
    );

    if (userProfilesOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, userProfilesOrError.errorValue);
    }

    return userProfilesOrError.value;
  }

  static toEntity(userProfiles: UserProfiles): UserProfilesEntity {
    const entity = new UserProfilesEntity();

    if (!userProfiles.id.isNewIdentifier()) {
      entity.id = userProfiles.id.getString();
    }

    entity.userId = userProfiles.userId.getString();

    entity.profileImage = userProfiles.profileImage;
    entity.phoneNumber = userProfiles.phoneNumber;
    entity.gender = userProfiles.gender;
    entity.birthday = userProfiles.birthday.toISOString();
    entity.introduction = userProfiles.introduction;
    entity.mbti = userProfiles.mbti;
    entity.createdAt = userProfiles.createdAt.toISOString();
    entity.updatedAt = userProfiles.updatedAt.toISOString();
    entity.deletedAt = userProfiles.deletedAt ? userProfiles.deletedAt.toISOString() : null;

    return entity;
  }
}
