import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import {
  CheckRemainingTokensQuery,
  CheckRemainingTokensQueryResponse,
} from "~users/applications/queries/CheckRemainingTokens.query";
import { FindOneAuthUserQuery } from "~users/applications/queries/FindOneAuthUser.query";
import { FindOneUserQuery } from "~users/applications/queries/FindOneUser.query";
import { Users } from "~users/domains/users/models/Users";
import { UsersService } from "~users/domains/users/users.service";
import { SchemaAuthUsersMapper } from "~users/presentations/grpc/auth-users.mapper";
import { SchemaUsersMapper } from "~users/presentations/grpc/users.mapper";
import {
  CheckRemainingTokensRequest,
  CheckRemainingTokensResponse,
  CheckRemainingTokensResponseSchema,
  FindAuthUserByAuthUserIdRequest,
  FindAuthUserByAuthUserIdResponse,
  FindAuthUserByAuthUserIdResponseSchema,
  FindAuthUserByChannelInfoRequest,
  FindAuthUserByChannelInfoResponse,
  FindAuthUserByChannelInfoResponseSchema,
  FindAuthUserByUserIdRequest,
  FindAuthUserByUserIdResponse,
  FindAuthUserByUserIdResponseSchema,
  FindUserByNicknameRequest,
  FindUserByNicknameResponse,
  FindUserByNicknameResponseSchema,
  FindUserByUserIdRequest,
  FindUserByUserIdResponse,
  FindUserByUserIdResponseSchema,
} from "~proto/com/hearlers/v1/service/user_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("user")
export class GrpcUserQueryController {
  constructor(private readonly queryBus: QueryBus, private readonly usersService: UsersService) {}

  @GrpcMethod("UserService", "FindUserByUserId")
  async findUserByUserId(data: FindUserByUserIdRequest): Promise<FindUserByUserIdResponse> {
    const query: FindOneUserQuery = new FindOneUserQuery({
      userId: data.userId ? new UniqueEntityId(data.userId) : undefined,
    });
    const user: Users = await this.queryBus.execute(query);

    return create(FindUserByUserIdResponseSchema, { user: SchemaUsersMapper.toUserProto(user) });
  }

  @GrpcMethod("UserService", "FindUserByNickname")
  async findUserByNickname(data: FindUserByNicknameRequest): Promise<FindUserByNicknameResponse> {
    const query: FindOneUserQuery = new FindOneUserQuery({
      nickname: data.nickname,
    });
    const user = await this.queryBus.execute(query);
    const response = create(FindUserByNicknameResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
    });
    return response;
  }

  @GrpcMethod("UserService", "FindAuthUserByAuthUserId")
  async findAuthUserByAuthUserId(data: FindAuthUserByAuthUserIdRequest): Promise<FindAuthUserByAuthUserIdResponse> {
    const query: FindOneAuthUserQuery = new FindOneAuthUserQuery({
      authUserId: data.authUserId ? new UniqueEntityId(data.authUserId) : undefined,
    });
    const authUser = await this.queryBus.execute(query);
    const response = create(FindAuthUserByAuthUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
    return response;
  }

  @GrpcMethod("UserService", "FindAuthUserByUserId")
  async findAuthUserByUserId(data: FindAuthUserByUserIdRequest): Promise<FindAuthUserByUserIdResponse> {
    const query: FindOneAuthUserQuery = new FindOneAuthUserQuery({
      userId: data.userId ? new UniqueEntityId(data.userId) : undefined,
    });
    const authUser = await this.queryBus.execute(query);
    const response = create(FindAuthUserByUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
    return response;
  }

  @GrpcMethod("UserService", "FindAuthUserByChannelInfo")
  async findAuthUserByChannelInfo(data: FindAuthUserByChannelInfoRequest): Promise<FindAuthUserByChannelInfoResponse> {
    const query: FindOneAuthUserQuery = new FindOneAuthUserQuery({
      authChannel: data.authChannel,
      uniqueId: data.uniqueId,
    });
    const authUser = await this.queryBus.execute(query);
    const response = create(FindAuthUserByChannelInfoResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
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
