import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { AuthUsersFacade } from "~users/applications/auth-users.facade";
import { UsersFacade } from "~users/applications/users.facade";
import { Users } from "~users/domains/users/models/users";
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
import { GrpcMethod } from "@nestjs/microservices";

@Controller("user")
export class GrpcUserQueryController {
  constructor(
    private readonly userFacade: UsersFacade,
    private readonly authUsersFacade: AuthUsersFacade,
  ) {}

  @GrpcMethod("UserService", "FindUserByUserId")
  async findUserByUserId(data: FindUserByUserIdRequest): Promise<FindUserByUserIdResponse> {
    const user: Users = await this.userFacade.findOneUser({
      userId: new UniqueEntityId(data.userId),
    });

    return create(FindUserByUserIdResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
    });
  }

  @GrpcMethod("UserService", "FindUserByNickname")
  async findUserByNickname(data: FindUserByNicknameRequest): Promise<FindUserByNicknameResponse> {
    const user: Users = await this.userFacade.findOneUser({
      nickname: data.nickname,
    });

    return create(FindUserByNicknameResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByAuthUserId")
  async findAuthUserByAuthUserId(data: FindAuthUserByAuthUserIdRequest): Promise<FindAuthUserByAuthUserIdResponse> {
    const authUser = await this.authUsersFacade.findOneAuthUser({
      authUserId: new UniqueEntityId(data.authUserId),
    });

    return create(FindAuthUserByAuthUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByUserId")
  async findAuthUserByUserId(data: FindAuthUserByUserIdRequest): Promise<FindAuthUserByUserIdResponse> {
    const authUser = await this.authUsersFacade.findOneAuthUser({
      userId: new UniqueEntityId(data.userId),
    });

    return create(FindAuthUserByUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByChannelInfo")
  async findAuthUserByChannelInfo(data: FindAuthUserByChannelInfoRequest): Promise<FindAuthUserByChannelInfoResponse> {
    const authUser = await this.authUsersFacade.findOneAuthUser({
      authChannel: data.authChannel,
      uniqueId: data.uniqueId,
    });

    return create(FindAuthUserByChannelInfoResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "CheckRemainingTokens")
  async checkRemainingTokens(data: CheckRemainingTokensRequest): Promise<CheckRemainingTokensResponse> {
    const { remainingTokens, maxTokens, reserved } = await this.userFacade.checkRemainingTokens(
      new UniqueEntityId(data.userId),
    );

    return create(CheckRemainingTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }
}
