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
  totalUserMessageCount: number;
  lastInteractionAt: Dayjs | null;
  dailyIncreasedRapport: number;
  dailyRapportResetAt: Dayjs | null;
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
        totalUserMessageCount: 0,
        lastInteractionAt: null,
        dailyIncreasedRapport: 0,
        dailyRapportResetAt: null,
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
    if (Number.isInteger(this.props.rapport) === false) {
      return Result.fail("[CounselorUserRelationships] 친밀도 수치는 정수여야 합니다");
    }

    // Total User Message Count 검증
    if (!isDefined(this.props.totalUserMessageCount)) {
      return Result.fail("[CounselorUserRelationships] 총 유저 메시지 수는 필수입니다");
    }
    if (this.props.totalUserMessageCount < 0) {
      return Result.fail("[CounselorUserRelationships] 총 유저 메시지 수는 0이상이어야 합니다");
    }
    if (Number.isInteger(this.props.totalUserMessageCount) === false) {
      return Result.fail("[CounselorUserRelationships] 총 유저 메시지 수는 정수여야 합니다");
    }

    // Last Interaction At 검증
    if (this.props.lastInteractionAt && !this.props.lastInteractionAt.isValid()) {
      return Result.fail("[CounselorUserRelationships] 마지막 상호작용 시간 형식이 올바르지 않습니다");
    }

    // daily Increased Rapport 검증
    if (!isDefined(this.props.dailyIncreasedRapport)) {
      return Result.fail("[CounselorUserRelationships] 일일 증가한 친밀도 수치는 필수입니다");
    }
    if (this.props.dailyIncreasedRapport < 0) {
      return Result.fail("[CounselorUserRelationships] 일일 증가한 친밀도 수치는 0이상이어야 합니다");
    }
    if (Number.isInteger(this.props.dailyIncreasedRapport) === false) {
      return Result.fail("[CounselorUserRelationships] 일일 증가한 친밀도 수치는 정수여야 합니다");
    }

    // daily Rapport Reset At 검증
    if (this.props.dailyRapportResetAt && !this.props.dailyRapportResetAt.isValid()) {
      return Result.fail("[CounselorUserRelationships] 일일 친밀도 초기화 시간 형식이 올바르지 않습니다");
    }

    /// 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail("[CounselorUserRelationships] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail("[CounselorUserRelationships] 수정 시간은 필수입니다");
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

  get totalUserMessageCount(): number {
    return this.props.totalUserMessageCount;
  }

  get lastInteractionAt(): Dayjs | null {
    return this.props.lastInteractionAt;
  }

  get dailyIncreasedRapport(): number {
    return this.props.dailyIncreasedRapport;
  }

  get dailyRapportResetAt(): Dayjs | null {
    return this.props.dailyRapportResetAt;
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
  /**
   * 친밀도 증가 적용
   * @param amount 증가량
   * @param dailyCap 일일 최대 증가량
   */
  public applyRapportIncrease(params: { amount: number; dailyCap: number }): Result<void> {
    const { amount, dailyCap } = params;
    if (!Number.isInteger(amount) || amount < 0) {
      return Result.fail("[CounselorUserRelationships] 친밀도 증가량은 0 이상의 정수여야 합니다");
    }
    if (dailyCap <= 0) {
      return Result.fail("[CounselorUserRelationships] 일일 친밀도 상한선은 0보다 커야 합니다");
    }

    const now = getNowDayjs();

    // 날짜가 바뀌었으면 일일 증가량 초기화
    if (!this.props.dailyRapportResetAt || !this.props.dailyRapportResetAt.isSame(now, "day")) {
      this.props.dailyIncreasedRapport = 0;
      this.props.dailyRapportResetAt = now.startOf("day");
    }

    // Cap Guard
    const remainingCap = Math.max(0, dailyCap - this.props.dailyIncreasedRapport);
    const earn = Math.min(remainingCap, amount);

    // Increase
    if (earn > 0) {
      this.props.rapport += earn;
      this.props.dailyIncreasedRapport += earn;
      this.props.updatedAt = now;
    }

    return Result.ok();
  }

  public markUserInteracted(): void {
    const now = getNowDayjs();
    this.props.totalUserMessageCount += 1;
    this.props.lastInteractionAt = now;
    this.props.updatedAt = now;
  }

  public applyRapportIncreaseWithInteraction(params: { amount: number; dailyCap: number }): Result<void> {
    this.markUserInteracted();
    return this.applyRapportIncrease(params);
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
