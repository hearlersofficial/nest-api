import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { UpdateAuthorityCommand } from "~users/aggregates/authUsers/applications/commands/UpdateAuthority/UpdateAuthority.command";
import { FindOneAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/dto/FindOneAuthUserUseCase.response";
import { FindOneAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/dto/UpdateAuthUserUseCase.response";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateAuthorityCommand)
export class UpdateAuthorityHandler implements ICommandHandler<UpdateAuthorityCommand, AuthUsers> {
  constructor(
    private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase,
    private readonly updateAuthUserUseCase: UpdateAuthUserUseCase,
  ) {}

  async execute(command: UpdateAuthorityCommand): Promise<AuthUsers> {
    const { authUserId, authority } = command.props;
    const findOneAuthUserUseCaseResponse: FindOneAuthUserUseCaseResponse = await this.findOneAuthUserUseCase.execute({
      authUserId,
    });
    const authUser: AuthUsers | null | undefined = findOneAuthUserUseCaseResponse.authUser;
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "AuthUser not found");
    }
    authUser.update({ authority });
    const updateAuthUserUseCaseResponse: UpdateAuthUserUseCaseResponse = await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    return updateAuthUserUseCaseResponse.authUser as AuthUsers;
  }
}
