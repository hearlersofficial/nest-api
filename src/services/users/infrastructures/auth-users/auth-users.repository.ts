import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/AuthUsers.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class AuthUsersRepository {
  abstract findByUserId(userId: UniqueEntityId, options?: FindOneOptions<AuthUsersEntity>): Promise<AuthUsers | null>;
  abstract findByAuthUserId(
    authUserId: UniqueEntityId,
    options?: FindOneOptions<AuthUsersEntity>,
  ): Promise<AuthUsers | null>;
  abstract findByChannelInfo(
    channelInfo: {
      uniqueId: string;
      authChannel: AuthChannel;
    },
    options?: FindOneOptions<AuthUsersEntity>,
  ): Promise<AuthUsers | null>;
  abstract findMany(options?: FindManyOptions<AuthUsersEntity>): Promise<AuthUsers[]>;
  abstract save(authUsers: AuthUsers): Promise<AuthUsers>;
  abstract save(authUsers: AuthUsers[]): Promise<AuthUsers[]>;
}

export interface FindOnePropsInAuthUsersRepository {
  userId?: UniqueEntityId;
  authUserId?: UniqueEntityId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
