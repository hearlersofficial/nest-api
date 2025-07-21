import { AuthFacade } from "~users/applications/auth/auth.facade";
import { UserManagementFacade } from "~users/applications/user-management/user-management.facade";
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
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

@Controller("user")
export class GrpcUserQueryController {
  constructor(
    private readonly userFacade: UserManagementFacade,
    private readonly authFacade: AuthFacade,
  ) {}

  @GrpcMethod("UserService", "FindUserByUserId")
  async findUserByUserId(data: FindUserByUserIdRequest): Promise<FindUserByUserIdResponse> {
    const user = await this.userFacade.findOneUser({
      userId: new UserId(data.userId),
    });

    return create(FindUserByUserIdResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
    });
  }

  @GrpcMethod("UserService", "FindUserByNickname")
  async findUserByNickname(data: FindUserByNicknameRequest): Promise<FindUserByNicknameResponse> {
    const user = await this.userFacade.findOneUser({
      nickname: data.nickname,
    });

    return create(FindUserByNicknameResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByAuthUserId")
  async findAuthUserByAuthUserId(data: FindAuthUserByAuthUserIdRequest): Promise<FindAuthUserByAuthUserIdResponse> {
    const authUser = await this.authFacade.findOneAuthUser({
      authUserId: new AuthUserId(data.authUserId),
    });

    return create(FindAuthUserByAuthUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByUserId")
  async findAuthUserByUserId(data: FindAuthUserByUserIdRequest): Promise<FindAuthUserByUserIdResponse> {
    const authUser = await this.authFacade.findOneAuthUser({
      userId: new UserId(data.userId),
    });

    return create(FindAuthUserByUserIdResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "FindAuthUserByChannelInfo")
  async findAuthUserByChannelInfo(data: FindAuthUserByChannelInfoRequest): Promise<FindAuthUserByChannelInfoResponse> {
    const authUser = await this.authFacade.findOneAuthUser({
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
      new UserId(data.userId),
    );

    return create(CheckRemainingTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }
}
