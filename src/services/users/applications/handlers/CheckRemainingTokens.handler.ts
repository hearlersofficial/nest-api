import {
  CheckRemainingTokensQuery,
  CheckRemainingTokensQueryResponse,
} from "~users/applications/queries/CheckRemainingTokens.query";
import { UsersService } from "~users/domains/users/users.service";

import { Injectable } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(CheckRemainingTokensQuery)
@Injectable()
export class CheckRemainingTokensHandler
  implements IQueryHandler<CheckRemainingTokensQuery, CheckRemainingTokensQueryResponse>
{
  constructor(private readonly usersService: UsersService) {}

  async execute(query: CheckRemainingTokensQuery): Promise<CheckRemainingTokensQueryResponse> {
    const { userId } = query.props;
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    return {
      remainingTokens: user.userMessageToken.remainingTokens,
      maxTokens: user.userMessageToken.maxTokens,
      reserved: user.userMessageToken.reserved,
    };
  }
}
