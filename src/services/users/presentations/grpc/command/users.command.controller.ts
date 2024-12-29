import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
import { SaveRefreshTokenCommand } from "~/src/aggregates/authUsers/applications/commands/SaveRefreshToken/SaveRefreshToken.command";
import { VerifyRefreshTokenCommand } from "~/src/aggregates/authUsers/applications/commands/VerifyRefreshToken/VerifyRefreshToken.command";
import { ReserveTokensCommand } from "~/src/aggregates/users/applications/commands/ReserveTokens/ReserveTokens.command";
import { UpdateUserCommand } from "~/src/aggregates/users/applications/commands/UpdateUser/UpdateUser.command";
import { Users } from "~/src/aggregates/users/domain/Users";
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
} from "~/src/gen/com/hearlers/v1/service/user_pb";
import { ConnectAuthChannelCommand } from "~/src/services/users/applications/commands/ConnectAuthChannel/ConnectAuthChannel.command";
import { InitializeUserCommand } from "~/src/services/users/applications/commands/InitializeUser/InitializeUser.command";
import { SchemaAuthUsersMapper } from "~/src/services/users/presentations/grpc/schema.authUsers.mapper";
import { SchemaUsersMapper } from "~/src/services/users/presentations/grpc/schema.users.mapper";
import { convertDayjs } from "~/src/shared/utils/Date.utils";

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
    const command: UpdateUserCommand = new UpdateUserCommand({
      userId: request.userId,
      nickname: request.nickname,
      userProfile: request.userProfile,
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
