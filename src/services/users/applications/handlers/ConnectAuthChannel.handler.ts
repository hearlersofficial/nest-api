import { Result } from "~shared/core/domain/Result";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  ConnectAuthChannelCommand,
  ConnectAuthChannelCommandResponse,
} from "~users/applications/commands/ConnectAuthChannel.command";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ConnectAuthChannelCommand)
@Injectable()
export class ConnectAuthChannelHandler
  implements ICommandHandler<ConnectAuthChannelCommand, ConnectAuthChannelCommandResponse>
{
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(command: ConnectAuthChannelCommand): Promise<ConnectAuthChannelCommandResponse> {
    const { userId, authChannel, uniqueId } = command.props;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });

    const connectAuthChannelResult: Result<void> = authUser.connectAuthChannel(authChannel, uniqueId);
    if (connectAuthChannelResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, connectAuthChannelResult.error as string);
    }

    await this.authUsersService.update(authUser);

    return {
      authUser,
    };
  }
}
