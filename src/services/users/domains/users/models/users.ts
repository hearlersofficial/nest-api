import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { TokenResetInterval } from "~shared/enums/TokenResetInterval.enum";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { generateUUID } from "~shared/utils/UUID.utils";
import { UserProfiles } from "~users/domains/users/models/use-profiles";
import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { Dayjs } from "dayjs";

export interface UsersNewProps {}

export interface UsersProps extends UsersNewProps {
  nickname: string;
  userProfile: UserProfiles;
  userMessageToken: UserMessageTokens;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Users extends AggregateRoot<UsersProps> {
  private constructor(props: UsersProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UsersProps, id: UniqueEntityId): Result<Users> {
    const users = new Users(props, id);
    const validateResult = users.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Users>(validateResult.error as string);
    }
    return Result.ok<Users>(users);
  }

  public static createNew(newProps: UsersNewProps): Result<Users> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    return this.create(
      {
        ...newProps,
        nickname: generateUUID(),
        // 계정 생성 시 프로필 기본값
        userProfile: UserProfiles.createNew({
          userId: newId,
          profileImage: "",
          phoneNumber: "",
          gender: Gender.UNSPECIFIED,
          mbti: Mbti.UNSPECIFIED,
          birthday: getNowDayjs(),
          introduction: "",
        }).value,
        // 계정 생성 시 메시지 토큰 기본값
        userMessageToken: UserMessageTokens.createNew({
          userId: newId,
          resetInterval: TokenResetInterval.SIX_HOURS,
          maxTokens: 7,
          remainingTokens: 7,
        }).value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  validateDomain(): Result<void> {
    // nickname 검증
    if (!this.props.nickname) {
      return Result.fail<void>("[Users] 닉네임은 필수입니다");
    }

    // userProfile 검증 (있는 경우)
    if (this.props.userProfile) {
      if (!this.props.userProfile.userId.equals(this.id)) {
        return Result.fail<void>("[Users] 프로필의 사용자 ID가 일치하지 않습니다");
      }
    }

    return Result.ok();
  }

  public updateNickname(nickname: string): Result<void> {
    this.props.nickname = nickname;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  // Getters
  get nickname(): string {
    return this.props.nickname;
  }

  get userProfile(): UserProfiles | undefined {
    return this.props.userProfile;
  }

  get userMessageToken(): UserMessageTokens {
    return this.props.userMessageToken;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }

  // Methods

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
