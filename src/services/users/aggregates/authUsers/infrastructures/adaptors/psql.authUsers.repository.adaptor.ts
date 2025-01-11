import { AuthUsersEntity } from "~shared/core/infrastructure/entities/AuthUsers.entity";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { PsqlAuthUsersMapper } from "~users/aggregates/authUsers/infrastructures/adaptors/mappers/psql.authUsers.mapper";
import {
  AuthUsersRepositoryPort,
  FindOnePropsInAuthUsersRepository,
} from "~users/aggregates/authUsers/infrastructures/authUsers.repository.port";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsRelations, FindOptionsWhere, Repository } from "typeorm";

export class PsqlAuthUsersRepositoryAdaptor implements AuthUsersRepositoryPort {
  constructor(@InjectRepository(AuthUsersEntity) private readonly authUsersRepository: Repository<AuthUsersEntity>) {}

  async create(authUsers: AuthUsers): Promise<AuthUsers> {
    const entity = PsqlAuthUsersMapper.toEntity(authUsers);
    const createdEntity = await this.authUsersRepository.create(entity);
    const result = await this.authUsersRepository.save(createdEntity);
    return PsqlAuthUsersMapper.toDomain(result);
  }

  async update(authUsers: AuthUsers): Promise<AuthUsers> {
    const entity = PsqlAuthUsersMapper.toEntity(authUsers);
    const createdEntity = await this.authUsersRepository.create(entity);
    const updatedEntity = await this.authUsersRepository.save(createdEntity);
    return PsqlAuthUsersMapper.toDomain(updatedEntity);
  }

  async findOne(props: FindOnePropsInAuthUsersRepository): Promise<AuthUsers | null> {
    const { userId, authUserId, channelInfo } = props;
    const relations: FindOptionsRelations<AuthUsersEntity> = {
      kakao: true,
      refreshTokens: true,
    };
    const where: FindOptionsWhere<AuthUsersEntity> = {};
    if (userId) {
      where.userId = userId;
    }
    if (authUserId) {
      where.id = authUserId;
    }
    if (channelInfo) {
      where.authChannel = channelInfo.authChannel;
      switch (channelInfo.authChannel) {
        case AuthChannel.KAKAO:
          where.kakao = { uniqueId: channelInfo.uniqueId };
          break;
      }
    }
    const result = await this.authUsersRepository.findOne({ where, relations });
    return result ? PsqlAuthUsersMapper.toDomain(result) : null;
  }
}
