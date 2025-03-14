import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CollectDomainEvents } from "~shared/core/infrastructure/decorators/collect-domain-events.decorator";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { DomainEventCollector } from "~shared/core/infrastructure/events/domain-event-collector";
import { Users } from "~users/domains/users/models/users";
import { PsqlUsersMapper } from "~users/infrastructures/mappers/psql.users.mapper";
import { UsersRepository } from "~users/infrastructures/users.repository";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
@CollectDomainEvents()
export class PsqlUsersRepository extends UsersRepository {
  private readonly userFindOptionsRelation: FindOptionsRelations<UsersEntity> = {
    userProfiles: true,
    userMessageTokens: true,
  };

  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    domainEventCollector: DomainEventCollector,
  ) {
    super(domainEventCollector);
  }

  override async save(user: Users): Promise<Users>;
  override async save(users: Users[]): Promise<Users[]>;
  async save(user: Users | Users[]): Promise<Users | Users[]> {
    if (Array.isArray(user)) {
      await this.usersRepository.save(PsqlUsersMapper.toEntities(user));
      return user;
    }
    const usersEntity = PsqlUsersMapper.toEntity(user);
    await this.usersRepository.save(usersEntity);
    return user;
  }

  override async findByUserId(userId: UniqueEntityId, options?: FindOneOptions<UsersEntity>): Promise<Users | null> {
    const findOneOptions: FindOneOptions<UsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: userId.getString(),
    };
    const user = await this.usersRepository.findOne(findOneOptions);
    return user ? PsqlUsersMapper.toDomain(user) : null;
  }

  override async findByNickname(nickname: string, options?: FindOneOptions<UsersEntity>): Promise<Users | null> {
    const findOneOptions: FindOneOptions<UsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      nickname,
    };
    const user = await this.usersRepository.findOne(findOneOptions);
    return user ? PsqlUsersMapper.toDomain(user) : null;
  }

  override async findMany(options?: FindManyOptions<UsersEntity>): Promise<Users[]> {
    const findManyOptions: FindManyOptions<UsersEntity> = options ?? {};
    const users = await this.usersRepository.find(findManyOptions);
    return PsqlUsersMapper.toDomains(users);
  }
}
