import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { BaseRepository } from "~shared/core/infrastructure/base-repository";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";
import { Users } from "~users/domains/users/models/users-domain";

import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class UsersRepository extends BaseRepository {
  constructor(domainEventCollector: DomainEventCollector) {
    super(domainEventCollector);
  }

  abstract findByUserId(userId: UniqueEntityId, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findByNickname(nickname: string, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findMany(options?: FindManyOptions<UsersEntity>): Promise<Users[]>;
  abstract save(user: Users): Promise<Users>;
  abstract save(users: Users[]): Promise<Users[]>;
}
