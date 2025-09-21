import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

export interface CounselorUserRelationshipsNewProps {
  userId: UserId;
  counselorId: CounselorId;
}

export interface CounselorUserRelationshipsProps extends CounselorUserRelationshipsNewProps {
  rapport: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselorUserRelationships extends AggregateRoot<
  CounselorUserRelationshipsProps,
  CounselorUserRelationshipId
> {
  private constructor(props: CounselorUserRelationshipsProps, id: CounselorUserRelationshipId) {
    super(props, id);
  }

  public static create(
    props: CounselorUserRelationshipsProps,
    id: CounselorUserRelationshipId,
  ): Result<CounselorUserRelationships> {
    const relationships = new CounselorUserRelationships(props, id);
    const validateResult = relationships.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselorUserRelationships>(validateResult.error as string);
    }
    return Result.ok<CounselorUserRelationships>(relationships);
  }

  public static createNew(newProps: CounselorUserRelationshipsNewProps): Result<CounselorUserRelationships> {
    const now = getNowDayjs();
    const newId = new CounselorUserRelationshipId();
    return this.create(
      {
        ...newProps,
        rapport: 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  private validateDomain(): Result<void> {
    // ID 검증
    if (!isDefined(this.props.userId)) {
      return Result.fail("[CounselorUserRelationships] 유저 ID는 필수입니다");
    }
    if (!isDefined(this.props.counselorId)) {
      return Result.fail("[CounselorUserRelationships] 상담사 ID는 필수입니다");
    }

    // Rapport 검증
    if (!isDefined(this.props.rapport)) {
      return Result.fail("[CounselorUserRelationships] 친밀도 수치는 필수입니다");
    }
    if (this.props.rapport < 0) {
      return Result.fail("[CounselorUserRelationships] 친밀도 수치는 0이상이어야 합니다");
    }

    /// 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail("[Counselors] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail("[Counselors] 수정 시간은 필수입니다");
    }
    return Result.ok();
  }

  // Getters
  get userId(): UserId {
    return this.props.userId;
  }

  get counselorId(): CounselorId {
    return this.props.counselorId;
  }

  get rapport(): number {
    return this.props.rapport;
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
  public increaseRapport(amount: number): void {
    this.props.rapport += amount;
    this.props.updatedAt = getNowDayjs();
  }

  public decreaseRapport(amount: number): void {
    this.props.rapport = Math.max(0, this.props.rapport - amount);
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
