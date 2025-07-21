import { AuthUsersStore } from "~users/domains/auth-users/auth-users.store";
import { AuthUsersRepository } from "~users/domains/auth-users/infrastructures/auth-users.repository";
import { AuthUsers, AuthUsersNewProps } from "~users/domains/auth-users/models/auth-users";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryAuthUsersStore extends AuthUsersStore {
  constructor(private readonly authUserRepository: AuthUsersRepository) {
    super();
  }

  override async create(authUser: AuthUsersNewProps): Promise<AuthUsers> {
    const authUserResult = AuthUsers.createNew(authUser);
    if (authUserResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, authUserResult.error as string);
    }
    return this.authUserRepository.save(authUserResult.value);
  }

  override async update(authUser: AuthUsers): Promise<AuthUsers> {
    return this.authUserRepository.save(authUser);
  }

  override async updateMany(authUsers: AuthUsers[]): Promise<AuthUsers[]> {
    return this.authUserRepository.save(authUsers);
  }
}
