import { UserTrackings } from "~users/domains/users/models/user-trackings";
import { Users } from "~users/domains/users/models/users";

import { Injectable } from "@nestjs/common";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingsEntity } from "~common/system/persistences/entities/users/user-trackings.entity";
import { UsersEntity } from "~common/system/persistences/entities/users/users.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class UsersRepository {
  abstract findByUserId(userId: UserId, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findByNickname(nickname: string, options?: FindOneOptions<UsersEntity>): Promise<Users | null>;
  abstract findMany(options?: FindManyOptions<UsersEntity>): Promise<Users[]>;
  abstract findTrackingByUserId(
    userId: UserId,
    options?: FindOneOptions<UserTrackingsEntity>,
  ): Promise<UserTrackings | null>;

  abstract save(user: Users): Promise<Users>;
  abstract save(users: Users[]): Promise<Users[]>;

  abstract saveUserTracking(userTracking: UserTrackings): Promise<UserTrackings>;
}
