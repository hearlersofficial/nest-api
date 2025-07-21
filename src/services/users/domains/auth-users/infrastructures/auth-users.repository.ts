import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class AuthUsersRepository {
  abstract findByUserId(userId: UserId, options?: FindOneOptions<AuthUsersEntity>): Promise<AuthUsers | null>;
  abstract findByAuthUserId(
    authUserId: AuthUserId,
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
  userId?: UserId;
  authUserId?: AuthUserId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
