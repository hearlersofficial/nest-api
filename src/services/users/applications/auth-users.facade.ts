import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isDefined } from "~shared/utils/Validate.utils";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUsers } from "~users/domains/auth-users/models/auth-users";
import { RefreshTokensVO } from "~users/domains/auth-users/models/refresh-tokens.vo";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Dayjs } from "dayjs";

@Injectable()
export class AuthUsersFacade {
  constructor(private readonly authUsersService: AuthUsersService) {}

  async findOneAuthUser(params: {
    authUserId?: UniqueEntityId;
    userId?: UniqueEntityId;
    authChannel?: AuthChannel;
    uniqueId?: string;
  }): Promise<AuthUsers> {
    const { authUserId, userId, authChannel, uniqueId } = params;

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

    throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 쿼리입니다");
  }

  async connectAuthChannel(params: {
    userId: UniqueEntityId;
    authChannel: AuthChannel;
    uniqueId: string;
  }): Promise<{ authUser: AuthUsers }> {
    const { userId, authChannel, uniqueId } = params;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });

    const connectAuthChannelResult: Result<void> = authUser.connectAuthChannel(authChannel, uniqueId);
    if (connectAuthChannelResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, connectAuthChannelResult.error as string);
    }

    await this.authUsersService.update(authUser);

    return {
      authUser,
    };
  }

  async saveRefreshToken(params: { userId: UniqueEntityId; token: string; expiresAt: Dayjs }): Promise<void> {
    const { userId, token, expiresAt } = params;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });

    const saveRefreshTokenResult = authUser.saveRefreshToken(token, expiresAt);
    if (saveRefreshTokenResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, saveRefreshTokenResult.error as string);
    }

    await this.authUsersService.update(authUser);
  }

  async verifyRefreshToken(params: { userId: UniqueEntityId; token: string }): Promise<{ success: boolean }> {
    const { userId, token } = params;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: userId } });

    const isRefreshTokenVerified: Result<RefreshTokensVO> = authUser.verifyRefreshToken(token);
    if (isRefreshTokenVerified.isFailure) {
      return {
        success: false,
      };
    }

    await this.authUsersService.update(authUser);

    return {
      success: true,
    };
  }

  async updateAuthority(params: { authUserId: UniqueEntityId; authority: Authority }): Promise<AuthUsers> {
    const { authUserId, authority } = params;
    const authUser = await this.authUsersService.getOne({ uniqueCriteria: { type: "authUser", id: authUserId } });

    authUser.update({ authority });

    return await this.authUsersService.update(authUser);
  }
}
