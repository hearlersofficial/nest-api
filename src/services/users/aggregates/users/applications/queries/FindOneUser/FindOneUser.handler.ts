// src/application/handlers/find-one-user.handler.ts
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { FindOneUserQuery } from "~users/aggregates/users/applications/queries/FindOneUser/FindOneUser.query";
import { FindOneUserUseCase } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/FindOneUserUseCase";
import { Users } from "~users/aggregates/users/domain/Users";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler implements IQueryHandler<FindOneUserQuery> {
  constructor(private readonly findOneUserUseCase: FindOneUserUseCase) {}

  async execute(query: FindOneUserQuery): Promise<Users> {
    const { userId } = query.props;

    const { ok, error, user } = await this.findOneUserUseCase.execute({ userId });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, error as string);
    }
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }
    return user;
  }
}
