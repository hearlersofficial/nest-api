import { PsqlUsersMapper } from "~users/domains/users/infrastructures/mappers/psql-user.mapper";
import { PsqlUserTrackingsMapper } from "~users/domains/users/infrastructures/mappers/psql-user-trackings.mapper";
import { UsersRepository } from "~users/domains/users/infrastructures/users.repository";
import { UserTrackings } from "~users/domains/users/models/user-trackings";
import { Users } from "~users/domains/users/models/users";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingsEntity } from "~common/system/persistences/entities/users/user-trackings.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class PsqlUsersRepository extends UsersRepository {
  private readonly userFindOptionsRelation: FindOptionsRelations<UsersEntity> = {
    userProfiles: true,
    userMessageTokens: true,
    userTrackings: false,
  };

  constructor(
    @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(UserTrackingsEntity) private readonly userTrackingsRepository: Repository<UserTrackingsEntity>,
  ) {
    super();
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

  override async findByUserId(userId: UserId, options?: FindOneOptions<UsersEntity>): Promise<Users | null> {
    const findOneOptions: FindOneOptions<UsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: userId.getString(),
    };
    findOneOptions.relations = { ...findOneOptions.relations, ...this.userFindOptionsRelation };
    const user = await this.usersRepository.findOne(findOneOptions);
    return user ? PsqlUsersMapper.toDomain(user) : null;
  }

  override async findByNickname(nickname: string, options?: FindOneOptions<UsersEntity>): Promise<Users | null> {
    const findOneOptions: FindOneOptions<UsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      nickname,
    };
    findOneOptions.relations = { ...findOneOptions.relations, ...this.userFindOptionsRelation };
    const user = await this.usersRepository.findOne(findOneOptions);
    return user ? PsqlUsersMapper.toDomain(user) : null;
  }

  override async findMany(options?: FindManyOptions<UsersEntity>): Promise<Users[]> {
    const findManyOptions: FindManyOptions<UsersEntity> = options ?? {};
    findManyOptions.relations = { ...findManyOptions.relations, ...this.userFindOptionsRelation };
    const users = await this.usersRepository.find(findManyOptions);
    return PsqlUsersMapper.toDomains(users);
  }

  override async findTrackingByUserId(
    userId: UserId,
    options?: FindOneOptions<UserTrackingsEntity>,
  ): Promise<UserTrackings | null> {
    const findOneOptions: FindOneOptions<UserTrackingsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      userId: userId.getString(),
    };
    const userTrackings = await this.userTrackingsRepository.findOne(findOneOptions);
    return userTrackings ? PsqlUserTrackingsMapper.toDomain(userTrackings) : null;
  }

  override async saveUserTracking(userTracking: UserTrackings): Promise<UserTrackings> {
    const userTrackingsEntity = PsqlUserTrackingsMapper.toEntity(userTracking);
    await this.userTrackingsRepository.save(userTrackingsEntity);
    return userTracking;
  }
}
