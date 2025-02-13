import { UseCase } from "~shared/core/applications/UseCase";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { FindOneAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/dto/FindOneAuthUserUseCase.response";
import { FindOneAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";
import { UpdateAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/dto/UpdateAuthUserUseCase.response";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { FindOneUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/dto/FindOneUserUseCase.response";
import { FindOneUserUseCase } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/dto/UpdateUserUseCase.response";
import { UpdateUserUseCase } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/UpdateUserUseCase";
import { Users } from "~users/aggregates/users/domain/Users";
import { ConnectAuthChannelUseCaseRequest } from "~users/applications/useCases/ConnectAuthChannelUseCase/dto/ConnectAuthChannelUseCase.request";
import { ConnectAuthChannelUseCaseResponse } from "~users/applications/useCases/ConnectAuthChannelUseCase/dto/ConnectAuthChannelUseCase.response";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class ConnectAuthChannelUseCase
  implements UseCase<ConnectAuthChannelUseCaseRequest, ConnectAuthChannelUseCaseResponse>
{
  constructor(
    private readonly updateAuthUserUseCase: UpdateAuthUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
  ) {}

  async execute(request: ConnectAuthChannelUseCaseRequest): Promise<ConnectAuthChannelUseCaseResponse> {
    const { userId, channelInfo } = request;

    const { authUser, user } = await this.getUserAndAuthUser(userId);
    authUser.connectAuthChannel(channelInfo.authChannel, channelInfo.uniqueId);
    user.userMessageToken.updateMaxTokens(1000);

    const updateAuthUserResponse: UpdateAuthUserUseCaseResponse = await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    if (!updateAuthUserResponse.ok) {
      return {
        ok: false,
        error: updateAuthUserResponse.error,
      };
    }
    const updateUserResponse: UpdateUserUseCaseResponse = await this.updateUserUseCase.execute({
      toUpdateUser: user,
    });
    if (!updateUserResponse.ok) {
      return {
        ok: false,
        error: updateUserResponse.error,
      };
    }
    return { ok: true, authUser };
  }

  private async getUserAndAuthUser(userId: UniqueEntityId): Promise<{ user: Users; authUser: AuthUsers }> {
    const findOneAuthUserResponse: FindOneAuthUserUseCaseResponse = await this.findOneAuthUserUseCase.execute({
      userId,
    });
    if (!findOneAuthUserResponse.ok || !findOneAuthUserResponse.authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    const authUser = findOneAuthUserResponse.authUser;

    const findOneUserResponse: FindOneUserUseCaseResponse = await this.findOneUserUseCase.execute({
      userId,
    });
    if (!findOneUserResponse.ok || !findOneUserResponse.user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    const user = findOneUserResponse.user;

    return { user, authUser };
  }
}
