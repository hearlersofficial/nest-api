import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { SaveRefreshTokenCommand, SaveRefreshTokenResult } from "~users/applications/commands/SaveRefreshToken.command";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(SaveRefreshTokenCommand)
export class SaveRefreshTokenHandler implements ICommandHandler<SaveRefreshTokenCommand, SaveRefreshTokenResult> {
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(command: SaveRefreshTokenCommand): Promise<SaveRefreshTokenResult> {
    const { userId, token, expiresAt } = command.props;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });
    const saveRefreshTokenResult = authUser.saveRefreshToken(token, expiresAt);
    if (saveRefreshTokenResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, saveRefreshTokenResult.error as string);
    }
    await this.authUsersService.update(authUser);
    return new SaveRefreshTokenResult();
  }
}
