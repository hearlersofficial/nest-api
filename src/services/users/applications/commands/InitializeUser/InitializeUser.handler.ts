import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CreateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/CreateAuthUserUseCase/CreateAuthUserUseCase";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { CreateUserUseCase } from "~users/aggregates/users/applications/useCases/CreateUserUseCase/CreateUserUseCase";
import { CreateUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/CreateUserUseCase/dto/CreateUser.response";
import { Users } from "~users/aggregates/users/domain/Users";
import { InitializeUserCommand } from "~users/applications/commands/InitializeUser/InitializeUser.command";
import { BindAuthUserToUseUseCase } from "~users/applications/useCases/BindAuthUserToUseUseCase/BindAuthUserToUseUseCase";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(InitializeUserCommand)
export class InitializeUserHandler implements ICommandHandler<InitializeUserCommand> {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly createAuthUserUseCase: CreateAuthUserUseCase,
    private readonly bindAuthUserUseCase: BindAuthUserToUseUseCase,
  ) {}

  async execute(): Promise<{ user: Users; authUser: AuthUsers }> {
    const createUserUseCaseResponse: CreateUserUseCaseResponse = await this.createUserUseCase.execute();
    if (!createUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, createUserUseCaseResponse.error);
    }
    const user: Users = createUserUseCaseResponse.user;
    const createAuthUserUseCaseResponse = await this.createAuthUserUseCase.execute();
    if (!createAuthUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, createAuthUserUseCaseResponse.error);
    }
    const authUser: AuthUsers = createAuthUserUseCaseResponse.authUser;
    const bindAuthUserUseCaseResponse = await this.bindAuthUserUseCase.execute({
      user,
      authUser,
    });
    if (!bindAuthUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, bindAuthUserUseCaseResponse.error);
    }
    return { user, authUser };
  }
}
