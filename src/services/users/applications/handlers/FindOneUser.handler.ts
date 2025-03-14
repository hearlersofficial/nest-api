import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { FindOneUserQuery } from "~users/applications/queries/FindOneUser.query";
import { Users } from "~users/domains/users/models/Users";
import { UsersService } from "~users/domains/users/users.service";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindOneUserQuery)
export class FindOneUserHandler implements IQueryHandler<FindOneUserQuery> {
  constructor(private readonly usersService: UsersService) {}

  async execute(query: FindOneUserQuery): Promise<Users> {
    const { userId, nickname } = query.props;
    if (isDefined(userId)) {
      return this.usersService.getOne({
        uniqueCriteria: { type: "user", id: userId },
        options: { nickname: nickname ?? undefined },
      });
    }
    if (isDefined(nickname)) {
      return this.usersService.getOne({
        uniqueCriteria: { type: "nickname", nickname },
        options: { userId: userId ?? undefined },
      });
    }
    throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "UserId or nickname is required");
  }
}
