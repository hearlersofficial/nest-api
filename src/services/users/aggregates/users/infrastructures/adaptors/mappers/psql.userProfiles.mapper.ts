import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserProfilesEntity } from "~shared/core/infrastructure/entities/users/UserProfiles.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { UserProfiles } from "~users/aggregates/users/domain/UserProfiles";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlUserProfilesMapper {
  static toDomain(entity: UserProfilesEntity): UserProfiles | null {
    if (!entity) {
      return null;
    }

    const userProfilesProps = {
      userId: new UniqueEntityId(entity.userId),
      profileImage: entity.profileImage,
      phoneNumber: entity.phoneNumber,
      gender: entity.gender,
      birthday: convertUtcStringToDayjs(entity.birthday),
      introduction: entity.introduction,
      mbti: entity.mbti,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };

    const userProfilesOrError: Result<UserProfiles> = UserProfiles.create(
      userProfilesProps,
      new UniqueEntityId(entity.id),
    );

    if (userProfilesOrError.isFailure) {
      throw new InternalServerErrorException(userProfilesOrError.errorValue);
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
    entity.birthday = formatDayjsToUtcString(userProfiles.birthday);
    entity.introduction = userProfiles.introduction;
    entity.mbti = userProfiles.mbti;
    entity.createdAt = formatDayjsToUtcString(userProfiles.createdAt);
    entity.updatedAt = formatDayjsToUtcString(userProfiles.updatedAt);
    entity.deletedAt = userProfiles.deletedAt ? formatDayjsToUtcString(userProfiles.deletedAt) : null;

    return entity;
  }
}
