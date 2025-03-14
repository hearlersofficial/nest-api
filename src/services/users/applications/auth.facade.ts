import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { BindAuthUserToUseUseCase } from "~users/applications/use-cases/bind-user-to-auth-user";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/users";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class AuthFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly authUsersService: AuthUsersService,
    private readonly bindAuthUserUseCase: BindAuthUserToUseUseCase,
  ) {}

  async initializeUser(): Promise<{ user: Users; authUser: AuthUsers }> {
    const user = await this.usersService.create({});
    const authUser = await this.authUsersService.create({});

    const bindAuthUserUseCaseResponse = await this.bindAuthUserUseCase.execute({
      user,
      authUser,
    });

    if (!bindAuthUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        bindAuthUserUseCaseResponse.error as string,
      );
    }

    return { user, authUser };
  }
}
