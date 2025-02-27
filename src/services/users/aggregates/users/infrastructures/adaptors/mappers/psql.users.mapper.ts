import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { convertUtcStringToDayjs, formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { Users, UsersProps } from "~users/aggregates/users/domain/Users";
import { PsqlUserMessageTokensMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userMessageTokens.mapper";
import { PsqlUserProfilesMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userProfiles.mapper";
import { PsqlUserProgressesMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userProgresses.mapper";

import { InternalServerErrorException } from "@nestjs/common";

export class PsqlUsersMapper {
  static toDomain(entity: UsersEntity): Users | null {
    if (!entity) {
      return null;
    }

    const userProps: UsersProps = {
      nickname: entity.nickname,
      userProfile: entity.userProfiles ? PsqlUserProfilesMapper.toDomain(entity.userProfiles) : undefined,
      userProgresses:
        entity.userProgresses?.map((progress) => PsqlUserProgressesMapper.toDomain(progress)).filter(Boolean) || [],
      userMessageToken: entity.userMessageTokens
        ? PsqlUserMessageTokensMapper.toDomain(entity.userMessageTokens)
        : undefined,
      createdAt: convertUtcStringToDayjs(entity.createdAt),
      updatedAt: convertUtcStringToDayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? convertUtcStringToDayjs(entity.deletedAt) : null,
    };
    const usersOrError: Result<Users> = Users.create(userProps, new UniqueEntityId(entity.id));

    if (usersOrError.isFailure) {
      throw new InternalServerErrorException(usersOrError.errorValue);
    }

    return usersOrError.value;
  }

  static toEntity(users: Users): UsersEntity {
    const entity = new UsersEntity();

    if (!users.id.isNewIdentifier()) {
      entity.id = users.id.getString();
    }

    entity.nickname = users.nickname;

    // 관계 매핑
    if (users.userProfile) {
      entity.userProfiles = PsqlUserProfilesMapper.toEntity(users.userProfile);
    }
    if (users.userMessageToken) {
      entity.userMessageTokens = PsqlUserMessageTokensMapper.toEntity(users.userMessageToken);
    }

    entity.userProgresses = users.userProgresses.map((progress) => {
      const progressEntity = PsqlUserProgressesMapper.toEntity(progress);
      return progressEntity;
    });

    entity.createdAt = formatDayjsToUtcString(users.createdAt);
    entity.updatedAt = formatDayjsToUtcString(users.updatedAt);
    entity.deletedAt = users.deletedAt ? formatDayjsToUtcString(users.deletedAt) : null;

    return entity;
  }
}
