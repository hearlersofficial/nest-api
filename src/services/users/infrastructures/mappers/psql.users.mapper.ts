import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";
import { Users, UsersProps } from "~users/domains/users/models/users";
import { PsqlUserMessageTokensMapper } from "~users/infrastructures/mappers/psql.userMessageTokens.mapper";
import { PsqlUserProfilesMapper } from "~users/infrastructures/mappers/psql.userProfiles.mapper";

import { InternalServerErrorException } from "@nestjs/common";
import dayjs from "dayjs";

export class PsqlUsersMapper {
  static toDomain(entity: UsersEntity): Users | null {
    if (!entity) {
      return null;
    }

    const userProfile: UserProfiles | null = PsqlUserProfilesMapper.toDomain(entity.userProfiles);
    const userMessageToken: UserMessageTokens | null = PsqlUserMessageTokensMapper.toDomain(entity.userMessageTokens);
    if (!userProfile || !userMessageToken) {
      throw new InternalServerErrorException("User profile or user message token is not joined");
    }

    const userProps: UsersProps = {
      nickname: entity.nickname,
      userProfile: userProfile,
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
  static toDomains(entities: UsersEntity[]): Users[] {
    if (entities.length === 0) {
      return [];
    }
    return entities.map((entity) => this.toDomain(entity)).filter((user) => user !== null);
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

    entity.createdAt = users.createdAt.toISOString();
    entity.updatedAt = users.updatedAt.toISOString();
    entity.deletedAt = users.deletedAt ? users.deletedAt.toISOString() : null;

    return entity;
  }

  static toEntities(users: Users[]): UsersEntity[] {
    if (users.length === 0) {
      return [];
    }
    return users.map((user) => this.toEntity(user));
  }
}
