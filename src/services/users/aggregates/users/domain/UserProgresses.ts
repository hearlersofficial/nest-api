import { DomainEntity } from "~/src/shared/core/domain/DomainEntity";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { Dayjs } from "dayjs";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";
import { Result } from "~/src/shared/core/domain/Result";
import { ProgressStatus, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";

interface UserProgressesNewProps {
  userId: UniqueEntityId;
  status: ProgressStatus;
  progressType: ProgressType;
}

interface UserProgressesProps extends UserProgressesNewProps {
  lastUpdated: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserProgresses extends DomainEntity<UserProgressesProps> {
  private constructor(props: UserProgressesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserProgressesProps, id: UniqueEntityId): Result<UserProgresses> {
    const userProgresses = new UserProgresses(props, id);
    const validateResult = userProgresses.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserProgresses>(validateResult.error);
    }
    return Result.ok<UserProgresses>(userProgresses);
  }

  public static createNew(newProps: UserProgressesNewProps): Result<UserProgresses> {
    const now = getNowDayjs();
    return this.create(
      {
        ...newProps,
        lastUpdated: now,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      new UniqueEntityId(),
    );
  }

  validateDomain(): Result<void> {
    // userId 검증
    if (!this.props.userId) {
      return Result.fail<void>("[UserProgresses] 사용자 ID는 필수입니다");
    }

    // progressType 검증
    if (this.props.progressType === null || this.props.progressType === undefined) {
      return Result.fail<void>("[UserProgresses] 진행 유형은 필수입니다");
    }
    if (!Object.values(ProgressType).includes(this.props.progressType)) {
      return Result.fail<void>("[UserProgresses] 유효하지 않은 진행 유형입니다");
    }

    // status 검증
    if (this.props.status === null || this.props.status === undefined) {
      return Result.fail<void>("[UserProgresses] 상태는 필수입니다");
    }
    if (!Object.values(ProgressStatus).includes(this.props.status)) {
      return Result.fail<void>("[UserProgresses] 유효하지 않은 상태입니다");
    }

    // 날짜 검증
    if (!this.props.lastUpdated) {
      return Result.fail<void>("[UserProgresses] 마지막 업데이트 시간은 필수입니다");
    }
    if (!this.props.createdAt) {
      return Result.fail<void>("[UserProgresses] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[UserProgresses] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get progressType(): ProgressType {
    return this.props.progressType;
  }

  get status(): ProgressStatus {
    return this.props.status;
  }

  get lastUpdated(): Dayjs {
    return this.props.lastUpdated;
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
  public updateStatus(status: ProgressStatus): void {
    this.props.status = status;
    this.props.lastUpdated = getNowDayjs();
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
