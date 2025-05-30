import { ActivityType, DevicePlatform } from "~proto/com/hearlers/v1/model/user_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

interface UserActivitiesNewProps {
  userId: UniqueEntityId;
  activityType: ActivityType;
  activityData: Record<string, any>;
  platform: DevicePlatform;
  ipAddress: string;
  userAgent: string;
  durationSeconds: number;
}

export interface UserActivitiesProps extends UserActivitiesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserActivities extends DomainEntity<UserActivitiesProps> {
  private constructor(props: UserActivitiesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserActivitiesProps, id: UniqueEntityId): Result<UserActivities> {
    const userActivities = new UserActivities(props, id);
    const validateResult = userActivities.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserActivities>(validateResult.error as string);
    }
    return Result.ok<UserActivities>(userActivities);
  }

  public static createNew(newProps: UserActivitiesNewProps): Result<UserActivities> {
    const now = getNowDayjs();
    return this.create({ ...newProps, createdAt: now, updatedAt: now, deletedAt: null }, new UniqueEntityId());
  }

  validateDomain(): Result<void> {
    // userId 검증
    if (!this.props.userId) {
      return Result.fail<void>("[UserActivities] 사용자 ID는 필수입니다");
    }

    // activityType 검증
    if (this.props.activityType === null || this.props.activityType === undefined) {
      return Result.fail<void>("[UserActivities] 활동 유형은 필수입니다");
    }
    if (!Object.values(ActivityType).includes(this.props.activityType)) {
      return Result.fail<void>("[UserActivities] 유효하지 않은 활동 유형입니다");
    }

    // platform 검증
    if (this.props.platform === null || this.props.platform === undefined) {
      return Result.fail<void>("[UserActivities] 플랫폼은 필수입니다");
    }
    if (!Object.values(DevicePlatform).includes(this.props.platform)) {
      return Result.fail<void>("[UserActivities] 유효하지 않은 플랫폼입니다");
    }

    // durationSeconds 검증
    if (this.props.durationSeconds < 0) {
      return Result.fail<void>("[UserActivities] 지속 시간은 0 이상이어야 합니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[UserActivities] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[UserActivities] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get activityType(): ActivityType {
    return this.props.activityType;
  }

  get activityData(): Record<string, any> {
    return this.props.activityData;
  }

  get platform(): DevicePlatform {
    return this.props.platform;
  }

  get ipAddress(): string {
    return this.props.ipAddress;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get durationSeconds(): number {
    return this.props.durationSeconds;
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
  public updateActivity(
    props: Partial<{
      activityData: Record<string, any>;
      durationSeconds: number;
    }>,
  ): Result<void> {
    if (props.activityData !== undefined) {
      this.props.activityData = props.activityData;
    }
    if (props.durationSeconds !== undefined) {
      if (props.durationSeconds < 0) {
        return Result.fail<void>("[UserActivities] 지속 시간은 0 이상이어야 합니다");
      }
      this.props.durationSeconds = props.durationSeconds;
    }

    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
