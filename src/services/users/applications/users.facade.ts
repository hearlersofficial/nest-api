import { UserProfilesProps } from "~users/domains/users/models/use-profiles";
import { Users } from "~users/domains/users/models/users";
import { UsersService } from "~users/domains/users/users.service";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import dayjs from "dayjs";

@Injectable()
export class UsersFacade {
  constructor(private readonly usersService: UsersService) {}

  async findOneUser(params: { userId?: UniqueEntityId; nickname?: string }): Promise<Users> {
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
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    const userMessageToken = user.userMessageToken;
    if (!userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "토큰이 없습니다.");
    }
    userMessageToken.consumeTokens(1);
    await this.usersService.update(user);

    return {
      remainingTokens: userMessageToken.remainingTokens,
      maxTokens: userMessageToken.maxTokens,
    };
  }

  async reserveTokens(userId: UniqueEntityId): Promise<{
    remainingTokens: number;
    maxTokens: number;
    reserved: boolean;
  }> {
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });
    const userMessageToken = user.userMessageToken;

    if (!userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.FORBIDDEN, "잔여 토큰이 없습니다.");
    }

    if (userMessageToken.isReserved()) {
      throw new HttpStatusBasedRpcException(HttpStatus.CONFLICT, "이미 예약된 토큰이 있습니다.");
    }

    userMessageToken.reserveTokens();

    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "user not found");
    }

    await this.usersService.update(user);

    return {
      remainingTokens: userMessageToken.remainingTokens,
      maxTokens: userMessageToken.maxTokens,
      reserved: userMessageToken.reserved,
    };
  }

  async updateUser(params: {
    userId: UniqueEntityId;
    nickname?: string;
    profileImage?: string;
    phoneNumber?: string;
    gender?: Gender;
    birthday?: string;
    introduction?: string;
    mbti?: Mbti;
  }): Promise<Users> {
    const { userId, profileImage, phoneNumber, gender, birthday, introduction, mbti } = params;

    // 기존 사용자 조회
    const user = await this.usersService.getOne({ uniqueCriteria: { type: "user", id: userId } });

    // 닉네임 업데이트
    if (params.nickname) {
      user.updateNickname(params.nickname);
    }

    // 프로필 업데이트
    if (profileImage || phoneNumber || gender || birthday || introduction || mbti) {
      const updateProps: Partial<UserProfilesProps> = {};
      if (profileImage) updateProps.profileImage = profileImage;
      if (phoneNumber) updateProps.phoneNumber = phoneNumber;
      if (gender) updateProps.gender = gender;
      if (birthday) updateProps.birthday = dayjs(birthday);
      if (introduction) updateProps.introduction = introduction;
      if (mbti) updateProps.mbti = mbti;

      if (user.userProfile) {
        const updateResult = user.userProfile.updateProfile(updateProps);
        if (updateResult.isFailure) {
          throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error as string);
        }
      }
    }

    // 사용자 업데이트
    return await this.usersService.update(user);
  }
}
