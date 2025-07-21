import { UsersInfo } from "~users/domains/users/models/users.info";
import { UsersService } from "~users/domains/users/users.service";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class UserManagementFacade {
  constructor(private readonly usersService: UsersService) {}

  async findOneUser(params: { userId?: UniqueEntityId; nickname?: string }): Promise<UsersInfo> {
    const { userId, nickname } = params;
    if (isDefined(userId)) {
      return this.usersService.getOne({
        uniqueCriteria: { type: "user", id: userId },
        options: { nickname: nickname ?? undefined },
      });
    }
    if (isDefined(nickname)) {
      return this.usersService.getOne({
        uniqueCriteria: { type: "nickname", nickname },
        options: { userId: userId ?? undefined },
      });
    }
    throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "UserId 또는 nickname이 필요합니다");
  }

  async checkRemainingTokens(userId: UniqueEntityId): Promise<{
    remainingTokens: number;
    maxTokens: number;
    reserved: boolean;
  }> {
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    return {
      remainingTokens: user.userMessageToken.remainingTokens,
      maxTokens: user.userMessageToken.maxTokens,
      reserved: user.userMessageToken.reserved,
    };
  }

  async consumeTokens(userId: UniqueEntityId): Promise<{
    remainingTokens: number;
    maxTokens: number;
  }> {
    const user = await this.usersService.consumeTokens(userId, 1);

    return {
      remainingTokens: user.userMessageToken.remainingTokens,
      maxTokens: user.userMessageToken.maxTokens,
    };
  }

  async reserveTokens(userId: UniqueEntityId): Promise<{
    remainingTokens: number;
    maxTokens: number;
    reserved: boolean;
  }> {
    const user = await this.usersService.reserveTokens(userId);

    return {
      remainingTokens: user.userMessageToken.remainingTokens,
      maxTokens: user.userMessageToken.maxTokens,
      reserved: user.userMessageToken.reserved,
    };
  }

  @Transactional()
  async updateUser(params: {
    userId: UniqueEntityId;
    nickname?: string;
    profile?: {
      profileImage?: string;
      phoneNumber?: string;
      gender?: Gender;
      birthday?: string;
      introduction?: string;
      mbti?: Mbti;
    };
  }): Promise<UsersInfo> {
    const { userId, nickname, profile } = params;
    const hasNickname = isDefined(nickname);
    const hasProfile = profile && Object.keys(profile).some((k) => isDefined(profile[k as keyof typeof profile]));

    if (!hasNickname && !hasProfile) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "변경할 정보가 없습니다.");
    }

    let updatedUser: UsersInfo | undefined;

    if (hasNickname) {
      updatedUser = await this.usersService.updateNickname(userId, nickname!);
    }

    if (hasProfile) {
      const profileToUpdate = Object.fromEntries(Object.entries(profile!).filter(([_, v]) => isDefined(v)));
      updatedUser = await this.usersService.updateProfile(userId, profileToUpdate);
    }

    return updatedUser!;
  }
}
