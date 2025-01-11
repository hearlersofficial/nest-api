import { FindOneAuthUserUseCaseResponse } from "~/src/services/users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/dto/FindOneAuthUserUseCase.response";
import { FindOneAuthUserUseCase } from "~/src/services/users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCase } from "~/src/services/users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

import { SaveRefreshTokenCommand, SaveRefreshTokenResult } from "./SaveRefreshToken.command";
import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SaveRefreshTokenCommand)
export class SaveRefreshTokenHandler implements ICommandHandler<SaveRefreshTokenCommand, SaveRefreshTokenResult> {
  constructor(
    private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase,
    private readonly updateAuthUserUseCase: UpdateAuthUserUseCase,
  ) {}

  async execute(command: SaveRefreshTokenCommand): Promise<SaveRefreshTokenResult> {
    const { userId, token, expiresAt } = command.props;
    const findOneAuthUserUseCaseResponse: FindOneAuthUserUseCaseResponse = await this.findOneAuthUserUseCase.execute({
      userId,
    });
    if (!findOneAuthUserUseCaseResponse.ok || !findOneAuthUserUseCaseResponse.authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
    }
    const authUser = findOneAuthUserUseCaseResponse.authUser;
    const saveRefreshTokenResult = authUser.saveRefreshToken(token, expiresAt);
    if (saveRefreshTokenResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, saveRefreshTokenResult.error);
    }
    await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    return new SaveRefreshTokenResult();
  }
}
