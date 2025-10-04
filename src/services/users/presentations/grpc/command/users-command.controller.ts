import { AuthFacade } from "~users/applications/auth/auth.facade";
import { UserManagementFacade } from "~users/applications/user-management/user-management.facade";
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
  UpdateTrackingRequest,
  UpdateTrackingResponse,
  UpdateTrackingResponseSchema,
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
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import dayjs from "dayjs";

@Controller("user")
export class GrpcUserCommandController {
  constructor(
    private readonly usersFacade: UserManagementFacade,
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
    const { authUser } = await this.authFacade.connectAuthChannel({
      userId: new UserId(userId),
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
    await this.authFacade.saveRefreshToken({
      userId: new UserId(userId),
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
    const { success } = await this.authFacade.verifyRefreshToken({
      userId: new UserId(userId),
      token,
    });
    return create(VerifyRefreshTokenResponseSchema, {
      success,
    });
  }

  @GrpcMethod("UserService", "UpdateUser")
  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { userId, nickname, profileImage, phoneNumber, gender, birthday, introduction, mbti } = request;
    const updatedUser = await this.usersFacade.updateUser({
      userId: new UserId(userId),
      nickname,
      profile: {
        profileImage,
        phoneNumber,
        gender,
        birthday,
        introduction,
        mbti,
      },
    });
    return create(UpdateUserResponseSchema, { user: SchemaUsersMapper.toUserProto(updatedUser) });
  }

  @GrpcMethod("UserService", "ReserveTokens")
  async reserveTokens(request: ReserveTokensRequest): Promise<ReserveTokensResponse> {
    const { remainingTokens, maxTokens, reserved } = await this.usersFacade.reserveTokens(new UserId(request.userId));
    return create(ReserveTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }

  @GrpcMethod("UserService", "UpdateAuthority")
  async updateAuthority(request: UpdateAuthorityRequest): Promise<UpdateAuthorityResponse> {
    const { authUserId, authority } = request;
    const authUser = await this.authFacade.updateAuthority({
      authUserId: new AuthUserId(authUserId),
      authority,
    });
    return create(UpdateAuthorityResponseSchema, { authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser) });
  }

  @GrpcMethod("UserService", "UpdateTracking")
  async updateTracking(request: UpdateTrackingRequest): Promise<UpdateTrackingResponse> {
    const { userId, hasSeenIntroCutscene } = request;
    const updatedTracking = await this.usersFacade.upsertTracking({
      userId: new UserId(userId),
      hasSeenIntroCutscene,
    });
    return create(UpdateTrackingResponseSchema, {
      userTracking: SchemaUsersMapper.toUserTrackingProto(updatedTracking),
    });
  }
}
