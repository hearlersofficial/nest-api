import { FindOneAuthUserUseCase } from "~/src/services/users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import {
  VerifyRefreshTokenCommand,
  VerifyRefreshTokenResult,
} from "~users/aggregates/authUsers/applications/commands/VerifyRefreshToken/VerifyRefreshToken.command";
import { FindOneAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/dto/FindOneAuthUserUseCase.response";
import { UpdateAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/dto/UpdateAuthUserUseCase.response";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(VerifyRefreshTokenCommand)
export class VerifyRefreshTokenHandler implements ICommandHandler<VerifyRefreshTokenCommand, VerifyRefreshTokenResult> {
  constructor(
    private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase,
    private readonly updateAuthUserUseCase: UpdateAuthUserUseCase,
  ) {}

  async execute(command: VerifyRefreshTokenCommand): Promise<VerifyRefreshTokenResult> {
    const { userId, token } = command.props;
    const findOneAuthUserUseCaseResponse: FindOneAuthUserUseCaseResponse = await this.findOneAuthUserUseCase.execute({
      userId,
    });
    if (!findOneAuthUserUseCaseResponse.authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "authUser not found");
    }
    const { authUser } = findOneAuthUserUseCaseResponse;
    const isRefreshTokenVerified = authUser.verifyRefreshToken(token);
    if (isRefreshTokenVerified.isFailure) {
      return {
        success: false,
      };
    }
    const updateAuthUserUseCaseResponse: UpdateAuthUserUseCaseResponse = await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    if (!updateAuthUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "failed to update auth user");
    }
    return {
      success: true,
    };
  }
}
