import { Result } from "~shared/core/domain/Result";
import {
  VerifyRefreshTokenCommand,
  VerifyRefreshTokenResult,
} from "~users/applications/commands/VerifyRefreshToken.command";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { RefreshTokensVO } from "~users/domains/auth-users/models/refresh-tokens.vo";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(VerifyRefreshTokenCommand)
export class VerifyRefreshTokenHandler implements ICommandHandler<VerifyRefreshTokenCommand, VerifyRefreshTokenResult> {
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(command: VerifyRefreshTokenCommand): Promise<VerifyRefreshTokenResult> {
    const { userId, token } = command.props;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });

    const isRefreshTokenVerified: Result<RefreshTokensVO> = authUser.verifyRefreshToken(token);
    if (isRefreshTokenVerified.isFailure) {
      return {
        success: false,
      };
    }
    await this.authUsersService.update(authUser);
    return {
      success: true,
    };
  }
}
