import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { UserMessageTokens } from "~users/aggregates/users/domain/UserMessageTokens";
import { UserProfiles } from "~users/aggregates/users/domain/UserProfiles";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";
import { Users, UsersProps } from "~users/aggregates/users/domain/Users";
import { PsqlUserMessageTokensMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userMessageTokens.mapper";
import { PsqlUserProfilesMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userProfiles.mapper";
import { PsqlUserProgressesMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userProgresses.mapper";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlUsersMapper {
  static toDomain(entity: UsersEntity): Users | null {
    if (!entity) {
      return null;
    }

    const userProfile: UserProfiles | null = entity.userProfiles
      ? PsqlUserProfilesMapper.toDomain(entity.userProfiles)
      : null;
    const userProgresses: UserProgresses[] = PsqlUserProgressesMapper.toDomains(entity.userProgresses);
    const userMessageToken: UserMessageTokens | null = entity.userMessageTokens
      ? PsqlUserMessageTokensMapper.toDomain(entity.userMessageTokens)
      : null;

    if (!userProfile || !userProgresses || !userMessageToken) {
      throw new InternalServerErrorException("Failed to map user profile, user progresses, or user message token");
    }

    const userProps: UsersProps = {
      nickname: entity.nickname,
      userProfile: userProfile,
      userProgresses: userProgresses,
      userMessageToken: userMessageToken,
      createdAt: dayjs(entity.createdAt),
      updatedAt: dayjs(entity.updatedAt),
      deletedAt: entity.deletedAt ? dayjs(entity.deletedAt) : null,
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

    entity.createdAt = users.createdAt.toISOString();
    entity.updatedAt = users.updatedAt.toISOString();
    entity.deletedAt = users.deletedAt ? users.deletedAt.toISOString() : null;

    return entity;
  }
}
