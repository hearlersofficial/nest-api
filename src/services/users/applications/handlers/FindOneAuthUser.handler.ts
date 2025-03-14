import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { FindOneAuthUserQuery } from "~users/applications/queries/FindOneAuthUser.query";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindOneAuthUserQuery)
export class FindOneAuthUserHandler implements IQueryHandler<FindOneAuthUserQuery, AuthUsers> {
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(query: FindOneAuthUserQuery): Promise<AuthUsers> {
    const { authUserId, userId, authChannel, uniqueId } = query.props;
    if (isDefined(authUserId)) {
      return this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: authUserId } });
    }
    if (isDefined(userId)) {
      return this.authUsersService.getOne({ uniqueCriteria: { type: "user", id: userId } });
    }
    if (isDefined(authChannel) && isDefined(uniqueId)) {
      return this.authUsersService.getOne({
        uniqueCriteria: { type: "channelInfo", authChannel, uniqueId },
      });
    }
    throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Invalid query");
  }
}
