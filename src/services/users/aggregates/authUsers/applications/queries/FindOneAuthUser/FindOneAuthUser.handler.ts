import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import {
  FindOneAuthUserQuery,
  FindOneAuthUserQueryResult,
} from "~users/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.query";
import { FindOneAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/FindOneAuthUserUseCase/FindOneAuthUserUseCase";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindOneAuthUserQuery)
export class FindOneAuthUserHandler implements IQueryHandler<FindOneAuthUserQuery, FindOneAuthUserQueryResult> {
  constructor(private readonly findOneAuthUserUseCase: FindOneAuthUserUseCase) {}

  async execute(query: FindOneAuthUserQuery): Promise<FindOneAuthUserQueryResult> {
    const { authUserId, userId, authChannel, uniqueId } = query.props;
    const { ok, error, authUser } = await this.findOneAuthUserUseCase.execute({
      authUserId: authUserId ?? undefined,
      userId: userId ?? undefined,
      channelInfo: {
        authChannel: authChannel ?? undefined,
        uniqueId: uniqueId ?? undefined,
      },
    });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, error);
    }
    return { authUser };
  }
}
