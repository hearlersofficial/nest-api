import { UsersRepository } from "~users/domains/users/infrastructures/users.repository";
import { Users, UsersNewProps } from "~users/domains/users/models/users";
import { UsersPersistor } from "~users/domains/users/users.persistor";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryUsersPersistor extends UsersPersistor {
  constructor(private readonly userRepository: UsersRepository) {
    super();
  }

  override async create(user: UsersNewProps): Promise<Users> {
    const userResult = Users.createNew(user);
    if (userResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, userResult.error as string);
    }
    return this.userRepository.save(userResult.value);
  }

  override async update(user: Users): Promise<Users> {
    return this.userRepository.save(user);
  }

  override async updateMany(users: Users[]): Promise<Users[]> {
    return this.userRepository.save(users);
  }
}
