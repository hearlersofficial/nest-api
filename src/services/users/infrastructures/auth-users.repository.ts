import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { BaseRepository } from "~shared/core/infrastructure/base-repository";
import { AuthUsersEntity } from "~shared/core/infrastructure/entities/users/AuthUsers.entity";
import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class AuthUsersRepository extends BaseRepository {
  constructor(protected readonly domainEventCollector: DomainEventCollector) {
    super(domainEventCollector);
  }
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
