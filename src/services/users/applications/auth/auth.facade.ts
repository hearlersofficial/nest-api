import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUserInfo } from "~users/domains/auth-users/models/auth-user.info";
import { UsersInfo } from "~users/domains/users/models/users.info";
import { UsersService } from "~users/domains/users/users.service";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Dayjs } from "dayjs";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class AuthFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  async initializeUser(): Promise<{ user: UsersInfo; authUser: AuthUserInfo }> {
    const user = await this.usersService.create({});
    const authUser = await this.authUsersService.create({});

    await this.authUsersService.bindUser(new UniqueEntityId(authUser.id), new UniqueEntityId(user.id));

    return { user, authUser };
  }

  async findOneAuthUser(params: {
    authUserId?: UniqueEntityId;
    userId?: UniqueEntityId;
    authChannel?: AuthChannel;
    uniqueId?: string;
  }): Promise<AuthUserInfo> {
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

  @Transactional()
  async connectAuthChannel(params: {
    userId: UniqueEntityId;
    authChannel: AuthChannel;
    uniqueId: string;
  }): Promise<{ authUser: AuthUserInfo }> {
    const { userId, authChannel, uniqueId } = params;

    const authUser = await this.authUsersService.connectAuthChannel(userId, authChannel, uniqueId);
    await this.usersService.updateMaxTokens(userId, 1000);

    return {
      authUser,
    };
  }

  async saveRefreshToken(params: { userId: UniqueEntityId; token: string; expiresAt: Dayjs }): Promise<AuthUserInfo> {
    const { userId, token, expiresAt } = params;
    return await this.authUsersService.saveRefreshToken(userId, token, expiresAt);
  }

  async verifyRefreshToken(params: { userId: UniqueEntityId; token: string }): Promise<{ success: boolean }> {
    const { userId, token } = params;
    await this.authUsersService.verifyRefreshToken(userId, token);

    return {
      success: true,
    };
  }

  async updateAuthority(params: { authUserId: UniqueEntityId; authority: Authority }): Promise<AuthUserInfo> {
    const { authUserId, authority } = params;
    return await this.authUsersService.updateAuthority(authUserId, authority);
  }
}
