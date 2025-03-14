import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { InitializeUserCommand } from "~users/applications/commands/InitializeUser.command";
import { BindAuthUserToUseUseCase } from "~users/applications/useCases/BindAuthUserToUseUseCase/BindAuthUserToUseUseCase";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/Users";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(InitializeUserCommand)
export class InitializeUserHandler implements ICommandHandler<InitializeUserCommand> {
  constructor(
    private readonly usersService: UsersService,
    private readonly authUsersService: AuthUsersService,
    private readonly bindAuthUserUseCase: BindAuthUserToUseUseCase,
  ) {}

  async execute(): Promise<{ user: Users; authUser: AuthUsers }> {
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
