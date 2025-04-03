import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UsersEntity } from "~shared/core/infrastructure/entities/users/Users.entity";
import { Users } from "~users/domains/users/models/users";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class UsersRepository {
  abstract findByUserId(userId: UniqueEntityId, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findByNickname(nickname: string, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findMany(options?: FindManyOptions<UsersEntity>): Promise<Users[]>;
  abstract save(user: Users): Promise<Users>;
  abstract save(users: Users[]): Promise<Users[]>;
}
