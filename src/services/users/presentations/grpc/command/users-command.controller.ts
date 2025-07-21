import { AuthFacade } from "~users/applications/auth/auth.facade";
import { AuthUsersFacade } from "~users/applications/auth/auth-users.facade";
import { UserManagementFacade } from "~users/applications/user-management/user-management.facade";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { Users } from "~users/domains/users/models/users";
import { SchemaAuthUsersMapper } from "~users/presentations/grpc/auth-users.mapper";
import { SchemaUsersMapper } from "~users/presentations/grpc/users.mapper";
import {
  ConnectAuthChannelRequest,
  ConnectAuthChannelResponse,
  ConnectAuthChannelResponseSchema,
  InitializeUserResponse,
  InitializeUserResponseSchema,
  ReserveTokensRequest,
  ReserveTokensResponse,
  ReserveTokensResponseSchema,
  SaveRefreshTokenRequest,
  SaveRefreshTokenResponse,
  SaveRefreshTokenResponseSchema,
  UpdateAuthorityRequest,
  UpdateAuthorityResponse,
  UpdateAuthorityResponseSchema,
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserResponseSchema,
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
  VerifyRefreshTokenResponseSchema,
} from "~proto/com/hearlers/v1/service/user_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import dayjs from "dayjs";

@Controller("user")
export class GrpcUserCommandController {
  constructor(
    private readonly usersFacade: UserManagementFacade,
    private readonly authUsersFacade: AuthUsersFacade,
    private readonly authFacade: AuthFacade,
  ) {}

  @GrpcMethod("UserService", "InitializeUser")
  async initializeUser(): Promise<InitializeUserResponse> {
    const { user, authUser } = await this.authFacade.initializeUser();
    return create(InitializeUserResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "ConnectAuthChannel")
  async connectAuthChannel(request: ConnectAuthChannelRequest): Promise<ConnectAuthChannelResponse> {
    const { userId, authChannel, uniqueId } = request;
    const { authUser } = await this.authUsersFacade.connectAuthChannel({
      userId: new UniqueEntityId(userId),
      authChannel,
      uniqueId,
    });
    return create(ConnectAuthChannelResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "SaveRefreshToken")
  async saveRefreshToken(request: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    const { userId, token, expiresAt } = request;
    await this.authUsersFacade.saveRefreshToken({
      userId: new UniqueEntityId(userId),
      token,
      expiresAt: dayjs(expiresAt),
    });
    return create(SaveRefreshTokenResponseSchema, {
      success: true,
    });
  }

  @GrpcMethod("UserService", "VerifyRefreshToken")
  async verifyRefreshToken(request: VerifyRefreshTokenRequest): Promise<VerifyRefreshTokenResponse> {
    const { userId, token } = request;
    const { success } = await this.authUsersFacade.verifyRefreshToken({
      userId: new UniqueEntityId(userId),
      token,
    });
    return create(VerifyRefreshTokenResponseSchema, {
      success,
    });
  }

  @GrpcMethod("UserService", "UpdateUser")
  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { userId, nickname, profileImage, phoneNumber, gender, birthday, introduction, mbti } = request;
    const updatedUser: Users = await this.usersFacade.updateUser({
      userId: new UniqueEntityId(userId),
      nickname,
      profileImage,
      phoneNumber,
      gender,
      birthday,
      introduction,
      mbti,
    });
    return create(UpdateUserResponseSchema, { user: SchemaUsersMapper.toUserProto(updatedUser) });
  }

  @GrpcMethod("UserService", "ReserveTokens")
  async reserveTokens(request: ReserveTokensRequest): Promise<ReserveTokensResponse> {
    const { remainingTokens, maxTokens, reserved } = await this.usersFacade.reserveTokens(
      new UniqueEntityId(request.userId),
    );
    return create(ReserveTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }

  @GrpcMethod("UserService", "UpdateAuthority")
  async updateAuthority(request: UpdateAuthorityRequest): Promise<UpdateAuthorityResponse> {
    const { authUserId, authority } = request;
    const authUser: AuthUsers = await this.authUsersFacade.updateAuthority({
      authUserId: new UniqueEntityId(authUserId),
      authority,
    });
    return create(UpdateAuthorityResponseSchema, { authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser) });
  }
}
