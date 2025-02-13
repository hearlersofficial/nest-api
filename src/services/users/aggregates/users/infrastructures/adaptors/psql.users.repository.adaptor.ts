import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { UsersEntity } from "~shared/core/infrastructure/entities/Users.entity";
import { Users } from "~users/aggregates/users/domain/Users";
import { PsqlUsersMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.users.mapper";
import {
  FindOnePropsInUsersRepository,
  UsersRepositoryPort,
<<<<<<< HEAD:src/services/users/aggregates/users/infrastructures/adaptors/psql.users.repository.adaptor.ts
} from "~users/aggregates/users/infrastructures/users.repository.port";

=======
} from "~/src/aggregates/users/infrastructures/users.repository.port";
import { UsersEntity } from "~/src/shared/core/infrastructure/entities/users/Users.entity";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_CLIENT } from "~/src/shared/core/infrastructure/Config";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/infrastructures/adaptors/psql.users.repository.adaptor.ts
import { Inject } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";

export class PsqlUsersRepositoryAdaptor implements UsersRepositoryPort {
  private readonly userFindOptionsRelation: FindOptionsRelations<UsersEntity> = {
    userProfiles: true,
    userProgresses: true,
    userPrompts: true,
    userMessageTokens: true,
  };

  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    @Inject(KAFKA_CLIENT) private readonly kafkaProducer: ClientKafka,
  ) {}

  async publishDomainEvents(user: Users): Promise<void> {
    const domainEvents = user.domainEvents;
    for (const domainEvent of domainEvents) {
      this.kafkaProducer.emit(domainEvent.topic, domainEvent.binary);
    }
  }

  async create(user: Users): Promise<Users> {
    await this.publishDomainEvents(user);
    const usersEntity = PsqlUsersMapper.toEntity(user);
    const createdUsersEntity = await this.usersRepository.create(usersEntity);
    const savedUsersEntity = await this.usersRepository.save(createdUsersEntity, { reload: true });

    return PsqlUsersMapper.toDomain(savedUsersEntity);
  }

  async findOne(props: FindOnePropsInUsersRepository): Promise<Users | null> {
    const { userId, nickname } = props;
    const findOptionsRelation = this.userFindOptionsRelation;
    const findOptionsWhere: FindOptionsWhere<UsersEntity> = {};
    if (userId) {
      findOptionsWhere.id = userId.getString();
    }
    if (nickname) {
      findOptionsWhere.nickname = nickname;
    }

    const findOneOptions: FindOneOptions<UsersEntity> = {
      where: findOptionsWhere,
      relations: findOptionsRelation,
    };
    const usersEntity: UsersEntity = await this.usersRepository.findOne(findOneOptions);
    const user = PsqlUsersMapper.toDomain(usersEntity);
    if (user) {
      await this.publishDomainEvents(user);
    }
    return user;
  }

  async update(user: Users): Promise<Users> {
    await this.publishDomainEvents(user);
    const usersEntity = PsqlUsersMapper.toEntity(user);
    const updatedUsersEntity = await this.usersRepository.save(usersEntity, { reload: true });
    return PsqlUsersMapper.toDomain(updatedUsersEntity);
  }
}
