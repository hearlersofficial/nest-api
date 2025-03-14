import { UseCase } from "~shared/core/applications/UseCase";
import { ConnectAuthChannelUseCaseRequest } from "~users/applications/useCases/ConnectAuthChannelUseCase/dto/ConnectAuthChannelUseCase.request";
import { ConnectAuthChannelUseCaseResponse } from "~users/applications/useCases/ConnectAuthChannelUseCase/dto/ConnectAuthChannelUseCase.response";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { UsersService } from "~users/domains/users/users.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class ConnectAuthChannelUseCase
  implements UseCase<ConnectAuthChannelUseCaseRequest, ConnectAuthChannelUseCaseResponse>
{
  constructor(private readonly usersService: UsersService, private readonly authUsersService: AuthUsersService) {}

  async execute(request: ConnectAuthChannelUseCaseRequest): Promise<ConnectAuthChannelUseCaseResponse> {
    const { userId, channelInfo } = request;

    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    authUser.connectAuthChannel(channelInfo.authChannel, channelInfo.uniqueId);
    user.userMessageToken.updateMaxTokens(1000);

    await this.authUsersService.update(authUser);
    await this.usersService.update(user);

    return { ok: true, authUser };
  }
}
