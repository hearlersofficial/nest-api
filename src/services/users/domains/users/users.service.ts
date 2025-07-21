import { UserProfilesProps } from "~users/domains/users/models/use-profiles";
import { UsersNewProps } from "~users/domains/users/models/users";
import { UsersInfo } from "~users/domains/users/models/users.info";
import { UsersCriteriaFindOne, UsersCriteriaUniqueKey } from "~users/domains/users/users.criteria";
import { UsersReader } from "~users/domains/users/users.reader";
import { UsersStore } from "~users/domains/users/users.store";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import dayjs from "dayjs";

@Injectable()
export class UsersService {
  constructor(
    private readonly reader: UsersReader,
    private readonly store: UsersStore,
  ) {}

  async create(newProps: UsersNewProps): Promise<UsersInfo> {
    const user = await this.store.create(newProps);
    return UsersInfo.fromDomain(user);
  }

  async updateNickname(userId: UniqueEntityId, nickname: string): Promise<UsersInfo> {
    const user = await this.reader.findOne({ uniqueCriteria: { type: "user", id: userId } });
    const existingUser = await this.reader.findOne({ uniqueCriteria: { type: "nickname", nickname } });
    if (!isDefined(user)) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    if (isDefined(existingUser)) {
      throw new HttpStatusBasedRpcException(HttpStatus.CONFLICT, "Nickname already exists");
    }
    user.updateNickname(nickname);
    await this.store.update(user);
    return UsersInfo.fromDomain(user);
  }

  async updateProfile(
    userId: UniqueEntityId,
    profile: {
      profileImage?: string;
      phoneNumber?: string;
      gender?: Gender;
      birthday?: string;
      introduction?: string;
      mbti?: Mbti;
    },
  ): Promise<UsersInfo> {
    const user = await this.reader.findOne({ uniqueCriteria: { type: "user", id: userId } });
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }

    if (
      profile.profileImage ||
      profile.phoneNumber ||
      profile.gender ||
      profile.birthday ||
      profile.introduction ||
      profile.mbti
    ) {
      const updateProps: Partial<UserProfilesProps> = {};
      if (profile.profileImage) updateProps.profileImage = profile.profileImage;
      if (profile.phoneNumber) updateProps.phoneNumber = profile.phoneNumber;
      if (profile.gender) updateProps.gender = profile.gender;
      if (profile.birthday) updateProps.birthday = dayjs(profile.birthday);
      if (profile.introduction) updateProps.introduction = profile.introduction;
      if (profile.mbti) updateProps.mbti = profile.mbti;

      if (user.userProfile) {
        const updateResult = user.userProfile.updateProfile(updateProps);
        if (updateResult.isFailure) {
          throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, updateResult.error as string);
        }
      }
    }

    await this.store.update(user);
    return UsersInfo.fromDomain(user);
  }

  async consumeTokens(userId: UniqueEntityId, count: number): Promise<UsersInfo> {
    const user = await this.reader.findOne({ uniqueCriteria: { type: "user", id: userId } });
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    user.userMessageToken.consumeTokens(count);
    await this.store.update(user);
    return UsersInfo.fromDomain(user);
  }

  async reserveTokens(userId: UniqueEntityId): Promise<UsersInfo> {
    const user = await this.reader.findOne({ uniqueCriteria: { type: "user", id: userId } });
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }

    if (!user.userMessageToken.hasRemainingTokens()) {
      throw new HttpStatusBasedRpcException(HttpStatus.FORBIDDEN, "잔여 토큰이 없습니다.");
    }

    if (user.userMessageToken.isReserved()) {
      throw new HttpStatusBasedRpcException(HttpStatus.CONFLICT, "이미 예약된 토큰이 있습니다.");
    }

    user.userMessageToken.reserveTokens();
    await this.store.update(user);
    return UsersInfo.fromDomain(user);
  }

  async updateMaxTokens(userId: UniqueEntityId, maxTokens: number): Promise<UsersInfo> {
    const user = await this.reader.findOne({ uniqueCriteria: { type: "user", id: userId } });
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    user.userMessageToken.updateMaxTokens(maxTokens);
    await this.store.update(user);
    return UsersInfo.fromDomain(user);
  }

  async findOne(props: {
    uniqueCriteria: UsersCriteriaUniqueKey;
    options?: UsersCriteriaFindOne;
  }): Promise<UsersInfo | null> {
    const user = await this.reader.findOne(props);
    return user ? UsersInfo.fromDomain(user) : null;
  }

  async getOne(props: { uniqueCriteria: UsersCriteriaUniqueKey; options?: UsersCriteriaFindOne }): Promise<UsersInfo> {
    const user = await this.findOne(props);
    if (!user) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "User not found");
    }
    return user;
  }
}
