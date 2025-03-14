import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ReserveTokensCommand, ReserveTokensCommandResponse } from "~users/applications/commands/ReserveTokens.command";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
@CommandHandler(ReserveTokensCommand)
export class ReserveTokensHandler implements ICommandHandler<ReserveTokensCommand, ReserveTokensCommandResponse> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: ReserveTokensCommand): Promise<ReserveTokensCommandResponse> {
    const { userId } = command.props;

    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });
    const userMessageToken = user.userMessageToken;
    if (!userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.FORBIDDEN, "잔여 토큰이 없습니다.");
    }

    if (userMessageToken.isReserved()) {
      throw new HttpStatusBasedRpcException(HttpStatus.CONFLICT, "이미 예약된 토큰이 있습니다.");
    }
    userMessageToken.reserveTokens();
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }
    await this.usersService.update(user);
    return {
      remainingTokens: userMessageToken.remainingTokens,
      maxTokens: userMessageToken.maxTokens,
      reserved: userMessageToken.reserved,
    };
  }
}
