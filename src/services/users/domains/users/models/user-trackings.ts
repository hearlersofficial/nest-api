import { getNowDayjs } from "~common/shared/utils/date";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";
import { Dayjs } from "dayjs";

interface UserTrackingsNewProps {
  userId: UserId;
  hasSeenIntroCutscene: boolean;
}

export interface UserTrackingsProps extends UserTrackingsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserTrackings extends DomainEntity<UserTrackingsProps, UserTrackingId> {
  private constructor(props: UserTrackingsProps, id: UserTrackingId) {
    super(props, id);
  }

  public static create(props: UserTrackingsProps, id: UserTrackingId): Result<UserTrackings> {
    const userTrackings = new UserTrackings(props, id);
    const validateResult = userTrackings.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserTrackings>(validateResult.error as string);
    }
    return Result.ok<UserTrackings>(userTrackings);
  }

  public static createNew(newProps: UserTrackingsNewProps): Result<UserTrackings> {
    const now = getNowDayjs();
    return this.create({ ...newProps, createdAt: now, updatedAt: now, deletedAt: null }, new UserTrackingId());
  }

  validateDomain(): Result<void> {
    // userId 검증
    if (!this.props.userId) {
      return Result.fail<void>("[UserTrackings] 사용자 ID는 필수입니다");
    }

    // hasSeenIntroCutscene 검증
    if (this.props.hasSeenIntroCutscene === null || this.props.hasSeenIntroCutscene === undefined) {
      return Result.fail<void>("[UserTrackings] 인트로 컷씬 시청 여부는 필수입니다");
    }
    if (typeof this.props.hasSeenIntroCutscene !== "boolean") {
      return Result.fail<void>("[UserTrackings] 인트로 컷씬 시청 여부는 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[UserTrackings] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[UserTrackings] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  public updateIntroCutsceneStatus(hasSeenIntroCutscene: boolean): Result<void> {
    this.props.hasSeenIntroCutscene = hasSeenIntroCutscene;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }

  // Getters
  get userId(): UserId {
    return this.props.userId;
  }

  get hasSeenIntroCutscene(): boolean {
    return this.props.hasSeenIntroCutscene;
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
}
