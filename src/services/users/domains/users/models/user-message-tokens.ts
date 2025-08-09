import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { getNowDayjs } from "~common/shared/utils/date";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokenId } from "~common/shared-kernel/identifiers/user-message-token.id";
import { Dayjs } from "dayjs";

interface UserMessageTokensNewProps {
  userId: UserId;
  resetInterval: TokenResetInterval;
  maxTokens: number;
  remainingTokens: number;
}

export interface UserMessageTokensProps extends UserMessageTokensNewProps {
  lastReset: Dayjs;
  reserved: boolean;
  reservedTimeout: Dayjs | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserMessageTokens extends DomainEntity<UserMessageTokensProps, UserMessageTokenId> {
  private constructor(props: UserMessageTokensProps, id: UserMessageTokenId) {
    super(props, id);
  }

  public static create(props: UserMessageTokensProps, id: UserMessageTokenId): Result<UserMessageTokens> {
    const userMessageTokens = new UserMessageTokens(props, id);
    const validateResult = userMessageTokens.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserMessageTokens>(validateResult.error as string);
    }
    return Result.ok<UserMessageTokens>(userMessageTokens);
  }

  public static createNew(props: UserMessageTokensNewProps): Result<UserMessageTokens> {
    const id = new UserMessageTokenId();
    return this.create(
      {
        ...props,
        lastReset: getNowDayjs(),
        createdAt: getNowDayjs(),
        updatedAt: getNowDayjs(),
        deletedAt: null,
        reserved: false,
        reservedTimeout: null,
      },
      id,
    );
  }

  public validateDomain(): Result<void> {
    return Result.ok();
  }

  // Getters
  public get userId(): UserId {
    return this.props.userId;
  }

  public get resetInterval(): TokenResetInterval {
    return this.props.resetInterval;
  }

  public get remainingTokens(): number {
    return this.props.remainingTokens;
  }

  public get maxTokens(): number {
    return this.props.maxTokens;
  }

  public get lastReset(): Dayjs {
    return this.props.lastReset;
  }

  public get reserved(): boolean {
    return this.props.reserved;
  }

  public get reservedTimeout(): Dayjs | null {
    return this.props.reservedTimeout;
  }

  public get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  public get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  public get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }

  // Methods
  public resetTokens(): Result<void> {
    this.props.remainingTokens = this.props.maxTokens;
    this.props.lastReset = getNowDayjs();
    return Result.ok();
  }

  public hasRemainingTokens(): boolean {
    return this.props.remainingTokens > 0;
  }

  // 토큰 예약 체크
  public isReserved(): boolean {
    if (!this.props.reserved) {
      return false;
    }

    if (this.props.reservedTimeout && this.props.reservedTimeout.isBefore(getNowDayjs())) {
      this.props.reservedTimeout = null;
      this.props.reserved = false;
      return false;
    }
    return true;
  }

  // 토큰 예약
  public reserveTokens(): Result<void> {
    this.props.reserved = true;
    this.props.reservedTimeout = getNowDayjs().add(60, "second");
    return Result.ok();
  }

  public releaseTokens(): Result<void> {
    this.props.reserved = false;
    this.props.reservedTimeout = null;
    return Result.ok();
  }

  // QUESTION: FIND ONE USER -> 토큰 소모체크 후 소모 vs 토큰 소모와 소모체크 별도로 분리후 소모는 메서드 없이 db 바로 소모
  // 동시성 문제로 정합성 문제 생길 수 있음!!! 락 걸자
  public consumeTokens(tokens: number): Result<void> {
    if (this.props.remainingTokens < tokens) {
      return Result.fail<void>("[UserMessageTokens] 토큰이 부족합니다");
    }
    // if (!this.isReserved()) {
    //   return Result.fail<void>("[UserMessageTokens] 토큰이 예약되어 있지 않습니다");
    // }
    this.releaseTokens();
    this.props.remainingTokens -= tokens;
    return Result.ok();
  }

  public isResetTime(): boolean {
    switch (this.props.resetInterval) {
      case TokenResetInterval.DAILY:
        return this.props.lastReset.isSame(getNowDayjs(), "day");
      case TokenResetInterval.HOURLY:
        return this.props.lastReset.isSame(getNowDayjs(), "hour");
      case TokenResetInterval.SIX_HOURS:
        return this.props.lastReset.isSame(getNowDayjs().subtract(6, "hour"), "hour");
      default:
        return false;
    }
  }

  public updateMaxTokens(maxTokens: number): Result<void> {
    this.props.maxTokens = maxTokens;
    this.props.remainingTokens = maxTokens;
    return Result.ok();
  }
}
