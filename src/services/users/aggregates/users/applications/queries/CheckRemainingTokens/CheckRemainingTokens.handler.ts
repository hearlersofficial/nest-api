import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  CheckRemainingTokensQuery,
  CheckRemainingTokensQueryResponse,
} from "~users/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.query";
import { FindOneUserUseCase } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(CheckRemainingTokensQuery)
export class CheckRemainingTokensHandler
  implements IQueryHandler<CheckRemainingTokensQuery, CheckRemainingTokensQueryResponse>
{
  constructor(private readonly findOneUserUseCase: FindOneUserUseCase) {}

  async execute(query: CheckRemainingTokensQuery): Promise<CheckRemainingTokensQueryResponse> {
    const { userId } = query.props;
    const { ok, error, user } = await this.findOneUserUseCase.execute({ userId });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }

    return {
      remainingTokens: user.userMessageToken.remainingTokens,
      maxTokens: user.userMessageToken.maxTokens,
      reserved: user.userMessageToken.reserved,
    };
  }
}
