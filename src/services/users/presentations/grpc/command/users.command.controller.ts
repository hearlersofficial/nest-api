import { convertDayjs } from "~shared/utils/Date.utils";
import { SaveRefreshTokenCommand } from "~users/aggregates/authUsers/applications/commands/SaveRefreshToken/SaveRefreshToken.command";
import { VerifyRefreshTokenCommand } from "~users/aggregates/authUsers/applications/commands/VerifyRefreshToken/VerifyRefreshToken.command";
import { ReserveTokensCommand } from "~users/aggregates/users/applications/commands/ReserveTokens/ReserveTokens.command";
import { UpdateUserCommand } from "~users/aggregates/users/applications/commands/UpdateUser/UpdateUser.command";
import { Users } from "~users/aggregates/users/domain/Users";
import { ConnectAuthChannelCommand } from "~users/applications/commands/ConnectAuthChannel/ConnectAuthChannel.command";
import { InitializeUserCommand } from "~users/applications/commands/InitializeUser/InitializeUser.command";
import { SchemaAuthUsersMapper } from "~users/presentations/grpc/schema.authUsers.mapper";
import { SchemaUsersMapper } from "~users/presentations/grpc/schema.users.mapper";
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
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateUserResponseSchema,
  VerifyRefreshTokenRequest,
  VerifyRefreshTokenResponse,
  VerifyRefreshTokenResponseSchema,
} from "~proto/com/hearlers/v1/service/user_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("user")
export class GrpcUserCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod("UserService", "InitializeUser")
  async initializeUser(): Promise<InitializeUserResponse> {
    const command: InitializeUserCommand = new InitializeUserCommand({});
    const { user, authUser } = await this.commandBus.execute(command);
    return create(InitializeUserResponseSchema, {
      user: SchemaUsersMapper.toUserProto(user),
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "ConnectAuthChannel")
  async connectAuthChannel(request: ConnectAuthChannelRequest): Promise<ConnectAuthChannelResponse> {
    const { userId, authChannel, uniqueId } = request;
    const command: ConnectAuthChannelCommand = new ConnectAuthChannelCommand({
      userId,
      authChannel,
      uniqueId,
    });
    const { authUser } = await this.commandBus.execute(command);
    return create(ConnectAuthChannelResponseSchema, {
      authUser: SchemaAuthUsersMapper.toAuthUserProto(authUser),
    });
  }

  @GrpcMethod("UserService", "SaveRefreshToken")
  async saveRefreshToken(request: SaveRefreshTokenRequest): Promise<SaveRefreshTokenResponse> {
    const { userId, token, expiresAt } = request;
    const command: SaveRefreshTokenCommand = new SaveRefreshTokenCommand({
      userId,
      token,
      expiresAt: convertDayjs(expiresAt),
    });
    await this.commandBus.execute(command);
    return create(SaveRefreshTokenResponseSchema, {
      success: true,
    });
  }

  @GrpcMethod("UserService", "VerifyRefreshToken")
  async verifyRefreshToken(request: VerifyRefreshTokenRequest): Promise<VerifyRefreshTokenResponse> {
    const { userId, token } = request;
    const command: VerifyRefreshTokenCommand = new VerifyRefreshTokenCommand({
      userId,
      token,
    });
    const { success } = await this.commandBus.execute(command);
    return create(VerifyRefreshTokenResponseSchema, {
      success,
    });
  }

  @GrpcMethod("UserService", "UpdateUser")
  async updateUser(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const { userId, nickname, profileImage, phoneNumber, gender, birthday, introduction, mbti } = request;
    const command: UpdateUserCommand = new UpdateUserCommand({
      userId,
      nickname,
      profileImage,
      phoneNumber,
      gender,
      birthday,
      introduction,
      mbti,
    });
    const updatedUser: Users = await this.commandBus.execute(command);
    return create(UpdateUserResponseSchema, { user: SchemaUsersMapper.toUserProto(updatedUser) });
  }

  @GrpcMethod("UserService", "ReserveTokens")
  async reserveTokens(request: ReserveTokensRequest): Promise<ReserveTokensResponse> {
    const command: ReserveTokensCommand = new ReserveTokensCommand({
      userId: request.userId,
    });
    const { remainingTokens, maxTokens, reserved } = await this.commandBus.execute(command);
    return create(ReserveTokensResponseSchema, {
      remainingTokens,
      maxTokens,
      reserved,
    });
  }
}
