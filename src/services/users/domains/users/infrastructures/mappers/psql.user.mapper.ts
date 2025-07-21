import { PsqlUserMessageTokensMapper } from "~users/domains/users/infrastructures/mappers/psql-user-message-token.mapper";
import { PsqlUserProfilesMapper } from "~users/domains/users/infrastructures/mappers/psql-user-profile.mapper";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";
import { Users, UsersProps } from "~users/domains/users/models/users";

import { HttpStatus } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { UsersEntity } from "~common/system/persistences/entities/users/user.entity";
import dayjs from "dayjs";

export class PsqlUsersMapper {
  static toDomain(entity: UsersEntity): Users | null {
    if (!entity) {
      return null;
    }

    const userProfile: UserProfiles | null = PsqlUserProfilesMapper.toDomain(entity.userProfiles);
    const userMessageToken: UserMessageTokens | null = PsqlUserMessageTokensMapper.toDomain(entity.userMessageTokens);
    if (!userProfile || !userMessageToken) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "User profile or user message token is not joined",
      );
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
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, usersOrError.errorValue);
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
