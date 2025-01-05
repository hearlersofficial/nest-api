import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
  ConsumeTokensCommand,
  ConsumeTokensCommandResponse,
} from "~/src/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.command";
import { FindOneUserUseCase } from "~/src/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";
import { UpdateUserUseCase } from "~/src/aggregates/users/applications/useCases/UpdateUserUseCase/UpdateUserUseCase";
import { UserMessageTokens } from "~/src/aggregates/users/domain/UserMessageTokens";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

@CommandHandler(ConsumeTokensCommand)
export class ConsumeTokensHandler implements ICommandHandler<ConsumeTokensCommand, ConsumeTokensCommandResponse> {
  constructor(
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  async execute(command: ConsumeTokensCommand): Promise<ConsumeTokensCommandResponse> {
    const { userId } = command.props;

    const findOneUserUseCaseResponse = await this.findOneUserUseCase.execute({ userId });
    if (!findOneUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다.");
    }
    const { user } = findOneUserUseCaseResponse;
    const userMessageToken: UserMessageTokens = user.userMessageToken;
    if (!userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "토큰이 없습니다.");
    }
    userMessageToken.consumeTokens(1);
    const updateUserUseCaseResponse = await this.updateUserUseCase.execute({ toUpdateUser: user });
    if (!updateUserUseCaseResponse.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "사용자 업데이트 실패");
    }
    return {
      remainingTokens: userMessageToken.remainingTokens,
      maxTokens: userMessageToken.maxTokens,
    };
  }
}
