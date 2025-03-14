import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ConsumeTokensCommand, ConsumeTokensCommandResponse } from "~users/applications/commands/ConsumeTokens.command";
import { UserMessageTokens } from "~users/domains/users/models/UserMessageTokens";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(ConsumeTokensCommand)
export class ConsumeTokensHandler implements ICommandHandler<ConsumeTokensCommand, ConsumeTokensCommandResponse> {
  constructor(private readonly usersService: UsersService) {}

  async execute(command: ConsumeTokensCommand): Promise<ConsumeTokensCommandResponse> {
    const { userId } = command.props;

    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    const userMessageToken: UserMessageTokens = user.userMessageToken;
    if (!userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "토큰이 없습니다.");
    }
    userMessageToken.consumeTokens(1);
    await this.usersService.update(user);

    return {
      remainingTokens: userMessageToken.remainingTokens,
      maxTokens: userMessageToken.maxTokens,
    };
  }
}
