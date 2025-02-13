import { FindOneAuthUserQuery } from "~users/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.query";
import {
  CheckRemainingTokensQuery,
  CheckRemainingTokensQueryResponse,
} from "~users/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.query";
import { FindOneUserQuery } from "~users/aggregates/users/applications/queries/FindOneUser/FindOneUser.query";
import { Users } from "~users/aggregates/users/domain/Users";
import { SchemaAuthUsersMapper } from "~users/presentations/grpc/schema.authUsers.mapper";
import { SchemaUsersMapper } from "~users/presentations/grpc/schema.users.mapper";
import {
  CheckRemainingTokensRequest,
  CheckRemainingTokensResponse,
  CheckRemainingTokensResponseSchema,
  FindOneAuthUserRequest,
  FindOneAuthUserResponse,
  FindOneAuthUserResponseSchema,
  FindOneUserRequest,
  FindOneUserResponse,
  FindOneUserResponseSchema,
<<<<<<< HEAD
} from "~proto/com/hearlers/v1/service/user_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
=======
} from "~/src/gen/com/hearlers/v1/service/user_pb";
import { SchemaUsersMapper } from "~/src/services/users/presentations/grpc/schema.users.mapper";
import { FindOneAuthUserQuery } from "~/src/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.query";
import { SchemaAuthUsersMapper } from "~/src/services/users/presentations/grpc/schema.authUsers.mapper";
import {
  CheckRemainingTokensQuery,
  CheckRemainingTokensQueryResponse,
} from "~/src/aggregates/users/applications/queries/CheckRemainingTokens/CheckRemainingTokens.query";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

@Controller("user")
export class GrpcUserQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod("UserService", "FindOneUser")
  async findOneUser(data: FindOneUserRequest): Promise<FindOneUserResponse> {
    const query: FindOneUserQuery = new FindOneUserQuery({
      userId: data.userId ? new UniqueEntityId(data.userId) : undefined,
      nickname: data.nickname,
    });
    const user: Users = await this.queryBus.execute(query);

    return create(FindOneUserResponseSchema, { user: SchemaUsersMapper.toUserProto(user) });
  }

  @GrpcMethod("UserService", "FindOneAuthUser")
  async findOneAuthUser(data: FindOneAuthUserRequest): Promise<FindOneAuthUserResponse> {
    const query: FindOneAuthUserQuery = new FindOneAuthUserQuery({
      authUserId: data.authUserId ? new UniqueEntityId(data.authUserId) : undefined,
      userId: data.userId ? new UniqueEntityId(data.userId) : undefined,
      authChannel: data.authChannel,
      uniqueId: data.uniqueId,
    });
    const { authUser } = await this.queryBus.execute(query);
    const response = create(FindOneAuthUserResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
    console.log(response);
    return response;
  }

  @GrpcMethod("UserService", "CheckRemainingTokens")
  async checkRemainingTokens(data: CheckRemainingTokensRequest): Promise<CheckRemainingTokensResponse> {
    const query: CheckRemainingTokensQuery = new CheckRemainingTokensQuery({
      userId: new UniqueEntityId(data.userId),
    });
    const { remainingTokens, maxTokens, reserved }: CheckRemainingTokensQueryResponse = await this.queryBus.execute(
      query,
    );
    return create(CheckRemainingTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }
}
