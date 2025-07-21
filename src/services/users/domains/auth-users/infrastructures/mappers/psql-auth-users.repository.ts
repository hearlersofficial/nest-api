import { AuthUsersRepository } from "~users/domains/auth-users/infrastructures/mappers/auth-users.repository";
import { PsqlAuthUsersMapper } from "~users/domains/auth-users/infrastructures/psql.authUsers.mapper";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { AuthUsersEntity } from "~common/system/persistences/entities/users/auth-users.entity";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class PsqlAuthUsersRepository extends AuthUsersRepository {
  constructor(@InjectRepository(AuthUsersEntity) private readonly authUsersRepository: Repository<AuthUsersEntity>) {
    super();
  }
  DEFAULT_RELATION: FindOptionsRelations<AuthUsersEntity> = {
    kakao: true,
    refreshTokens: true,
  };

  override async save(authUsers: AuthUsers): Promise<AuthUsers>;
  override async save(authUsers: AuthUsers[]): Promise<AuthUsers[]>;
  async save(authUsers: AuthUsers | AuthUsers[]): Promise<AuthUsers | AuthUsers[]> {
    if (Array.isArray(authUsers)) {
      await this.authUsersRepository.save(PsqlAuthUsersMapper.toEntities(authUsers));
      return authUsers;
    }
    await this.authUsersRepository.save(PsqlAuthUsersMapper.toEntity(authUsers));
    return authUsers;
  }

  override async findByAuthUserId(
    authUserId: UniqueEntityId,
    options?: FindOneOptions<AuthUsersEntity>,
  ): Promise<AuthUsers | null> {
    const findOneOptions: FindOneOptions<AuthUsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: authUserId.getString(),
    };

    const result = await this.authUsersRepository.findOne({
      ...findOneOptions,
      relations: { ...findOneOptions.relations, ...this.DEFAULT_RELATION },
    });
    return result ? PsqlAuthUsersMapper.toDomain(result) : null;
  }

  override async findByUserId(
    userId: UniqueEntityId,
    options?: FindOneOptions<AuthUsersEntity>,
  ): Promise<AuthUsers | null> {
    const findOneOptions: FindOneOptions<AuthUsersEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      userId: userId.getString(),
    };
    const result = await this.authUsersRepository.findOne({
      ...findOneOptions,
      relations: { ...findOneOptions.relations, ...this.DEFAULT_RELATION },
    });
    return result ? PsqlAuthUsersMapper.toDomain(result) : null;
  }

  override async findByChannelInfo(
    channelInfo: {
      uniqueId: string;
      authChannel: AuthChannel;
    },
    options?: FindOneOptions<AuthUsersEntity>,
  ): Promise<AuthUsers | null> {
    const findOneOptions: FindOneOptions<AuthUsersEntity> = options ?? {};
    switch (channelInfo.authChannel) {
      case AuthChannel.KAKAO:
        findOneOptions.where = {
          ...findOneOptions.where,
          authChannel: channelInfo.authChannel,
          kakao: { uniqueId: channelInfo.uniqueId },
        };
        break;
    }
    const result = await this.authUsersRepository.findOne({
      ...findOneOptions,
      relations: { ...findOneOptions.relations, ...this.DEFAULT_RELATION },
    });
    return result ? PsqlAuthUsersMapper.toDomain(result) : null;
  }

  override async findMany(options?: FindManyOptions<AuthUsersEntity>): Promise<AuthUsers[]> {
    const result = await this.authUsersRepository.find({
      ...options,
      relations: { ...options?.relations, ...this.DEFAULT_RELATION },
    });
    return PsqlAuthUsersMapper.toDomains(result);
  }
}
