import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { FindOneAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/dto/FindOneAuthUserUseCase.response";
import { FindOneAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/dto/UpdateAuthUserUseCase.response";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import {
  ConnectAuthChannelCommand,
  ConnectAuthChannelCommandResponse,
} from "~/src/services/users/applications/commands/ConnectAuthChannel/ConnectAuthChannel.command";
import { Result } from "~/src/shared/core/domain/Result";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

@CommandHandler(ConnectAuthChannelCommand)
export class ConnectAuthChannelHandler
  implements ICommandHandler<ConnectAuthChannelCommand, ConnectAuthChannelCommandResponse>
{
  constructor(
    private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase,
    private readonly updateAuthUserUseCase: UpdateAuthUserUseCase,
  ) {}

  async execute(command: ConnectAuthChannelCommand): Promise<ConnectAuthChannelCommandResponse> {
    const { userId, authChannel, uniqueId } = command.props;
    const findOneAuthUserUseCaseResponse: FindOneAuthUserUseCaseResponse = await this.findOneAuthUserUseCase.execute({
      userId,
    });
    if (!findOneAuthUserUseCaseResponse.authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "인증 유저를 찾을 수 없습니다.");
    }
    const { authUser } = findOneAuthUserUseCaseResponse;

    const connectAuthChannelResult: Result<void> = authUser.connectAuthChannel(authChannel, uniqueId);
    if (connectAuthChannelResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, connectAuthChannelResult.error);
    }

    const updateAuthUserUseCaseResponse: UpdateAuthUserUseCaseResponse = await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    if (!updateAuthUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateAuthUserUseCaseResponse.error);
    }
    return {
      authUser: updateAuthUserUseCaseResponse.authUser,
    };
  }
}
