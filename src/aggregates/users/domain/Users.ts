import { AggregateRoot } from "~/src/shared/core/domain/AggregateRoot";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { Result } from "~/src/shared/core/domain/Result";
import { Dayjs } from "dayjs";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";
import { Gender, Mbti, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { UserProfiles } from "~/src/aggregates/users/domain/UserProfiles";
import { UserProgresses } from "~/src/aggregates/users/domain/UserProgresses";
import { UserPrompts } from "~/src/aggregates/users/domain/UserPrompts";
import { UserMessageTokens } from "~/src/aggregates/users/domain/UserMessageTokens";
import { TokenResetInterval } from "~/src/shared/enums/TokenResetInterval.enum";
import { generateUUID } from "~/src/shared/utils/UUID.utils";

interface UsersNewProps {}

export interface UsersProps extends UsersNewProps {
  nickname: string;
  userProfile: UserProfiles;
  userProgresses: UserProgresses[];
  userMessageToken: UserMessageTokens;
  userPrompts: UserPrompts[];
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
      return Result.fail<Users>(validateResult.error);
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
        userProgresses: [],
        userPrompts: [],
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

    // userProgresses 검증
    for (const progress of this.props.userProgresses) {
      if (!progress.userId.equals(this.id)) {
        return Result.fail<void>("[Users] 진행 상태의 사용자 ID가 일치하지 않습니다");
      }
    }

    // userPrompts 검증
    for (const prompt of this.props.userPrompts) {
      if (!prompt.userId.equals(this.id)) {
        return Result.fail<void>("[Users] 프롬프트의 사용자 ID가 일치하지 않습니다");
      }
    }

    return Result.ok<void>();
  }

  public updateNickname(nickname: string): Result<void> {
    this.props.nickname = nickname;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  // Getters
  get nickname(): string {
    return this.props.nickname;
  }

  get userProfile(): UserProfiles | undefined {
    return this.props.userProfile;
  }

  get userProgresses(): UserProgresses[] {
    return [...this.props.userProgresses];
  }

  get userPrompts(): UserPrompts[] {
    return [...this.props.userPrompts];
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

  public addProgress(progress: UserProgresses): Result<void> {
    if (!progress.userId.equals(this.id)) {
      return Result.fail<void>("[Users] 진행 상태의 사용자 ID가 일치하지 않습니다");
    }
    this.props.userProgresses.push(progress);
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public addPrompt(prompt: UserPrompts): Result<void> {
    if (!prompt.userId.equals(this.id)) {
      return Result.fail<void>("[Users] 프롬프트의 사용자 ID가 일치하지 않습니다");
    }
    this.props.userPrompts.push(prompt);
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public findProgress(type: ProgressType): UserProgresses | undefined {
    return this.props.userProgresses.find((progress) => progress.progressType === type);
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
