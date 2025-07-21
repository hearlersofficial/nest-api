import {
  AuthUsersCriteriaFindMany,
  AuthUsersCriteriaFindOne,
  AuthUsersCriteriaUniqueKey,
} from "~users/domains/auth-users/auth-users.criteria";
import { AuthUsersReader } from "~users/domains/auth-users/auth-users.reader";
import { AuthUsersStore } from "~users/domains/auth-users/auth-users.store";
import { AuthUserInfo } from "~users/domains/auth-users/models/auth-user.info";
import { AuthUsersNewProps } from "~users/domains/auth-users/models/auth-users";
import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Dayjs } from "dayjs";

@Injectable()
export class AuthUsersService {
  constructor(
    private readonly reader: AuthUsersReader,
    private readonly store: AuthUsersStore,
  ) {}

  async create(newProps: AuthUsersNewProps): Promise<AuthUserInfo> {
    const authUser = await this.store.create(newProps);
    return AuthUserInfo.fromDomain(authUser);
  }

  async bindUser(authUserId: UniqueEntityId, userId: UniqueEntityId): Promise<AuthUserInfo> {
    const authUser = await this.reader.findOne({
      uniqueCriteria: {
        type: "authUser",
        id: authUserId,
      },
    });
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    authUser.bindUser(userId);
    return AuthUserInfo.fromDomain(authUser);
  }

  async connectAuthChannel(
    authUserId: UniqueEntityId,
    authChannel: AuthChannel,
    uniqueId: string,
  ): Promise<AuthUserInfo> {
    const authUser = await this.reader.findOne({
      uniqueCriteria: {
        type: "authUser",
        id: authUserId,
      },
    });
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    authUser.connectAuthChannel(authChannel, uniqueId);
    return AuthUserInfo.fromDomain(authUser);
  }

  async updateAuthority(authUserId: UniqueEntityId, authority: Authority): Promise<AuthUserInfo> {
    const authUser = await this.reader.findOne({
      uniqueCriteria: {
        type: "authUser",
        id: authUserId,
      },
    });
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    authUser.update({ authority });
    await this.store.update(authUser);
    return AuthUserInfo.fromDomain(authUser);
  }

  async verifyRefreshToken(authUserId: UniqueEntityId, token: string): Promise<AuthUserInfo> {
    const authUser = await this.reader.findOne({
      uniqueCriteria: {
        type: "authUser",
        id: authUserId,
      },
    });
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    const isRefreshTokenVerified: Result<RefreshTokens> = authUser.verifyRefreshToken(token);
    if (isRefreshTokenVerified.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }
    authUser.updateLastLoginAt();
    await this.store.update(authUser);
    return AuthUserInfo.fromDomain(authUser);
  }

  async saveRefreshToken(authUserId: UniqueEntityId, token: string, expiresAt: Dayjs): Promise<AuthUserInfo> {
    const authUser = await this.reader.findOne({
      uniqueCriteria: {
        type: "authUser",
        id: authUserId,
      },
    });
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    authUser.saveRefreshToken(token, expiresAt);
    return AuthUserInfo.fromDomain(authUser);
  }

  async findOne(props: {
    uniqueCriteria: AuthUsersCriteriaUniqueKey;
    options?: AuthUsersCriteriaFindOne;
  }): Promise<AuthUserInfo | null> {
    const authUser = await this.reader.findOne(props);
    return authUser ? AuthUserInfo.fromDomain(authUser) : null;
  }

  async getOne(props: { uniqueCriteria: AuthUsersCriteriaUniqueKey }): Promise<AuthUserInfo> {
    const authUser = await this.findOne(props);
    if (!authUser) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Auth user not found");
    }
    return authUser;
  }

  async findMany(props: AuthUsersCriteriaFindMany): Promise<AuthUserInfo[]> {
    const authUsers = await this.reader.findMany(props);
    return AuthUserInfo.fromDomainArray(authUsers);
  }
}
