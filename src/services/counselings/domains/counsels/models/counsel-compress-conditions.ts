import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselCompressConditionId } from "~common/shared-kernel/identifiers/counsel-compress-condition.id";
import { Dayjs } from "dayjs";

export interface CounselCompressConditionsNewProps {
  counselId: CounselId;
}

export interface CounselCompressConditionsProps extends CounselCompressConditionsNewProps {
  messageCountAtLastCompression: number;
  lastMessageCompressedAt: Dayjs | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

/**
 * 상담 압축 조건 (Counsel Compress Conditions) 도메인 모델
 * - 상담 세션의 메시지 압축 조건을 관리합니다.
 * - 일정 메시지 수 이상이 쌓였을 때 압축 여부를 판단하는 로직을 포함합니다.
 */
export class CounselCompressConditions extends DomainEntity<
  CounselCompressConditionsProps,
  CounselCompressConditionId
> {
  public static readonly COMPRESSION_THRESHOLD = 20;

  private constructor(props: CounselCompressConditionsProps, id: CounselCompressConditionId) {
    super(props, id);
  }

  public static create(
    props: CounselCompressConditionsProps,
    id: CounselCompressConditionId,
  ): Result<CounselCompressConditions> {
    const counselCompressCondition = new CounselCompressConditions(props, id);
    const result = counselCompressCondition.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<CounselCompressConditions>(counselCompressCondition);
  }

  public static createNew(newProps: CounselCompressConditionsNewProps): Result<CounselCompressConditions> {
    const now = getNowDayjs();
    const newId = new CounselCompressConditionId();
    return this.create(
      {
        ...newProps,
        messageCountAtLastCompression: 0,
        lastMessageCompressedAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }
  public validateDomain(): Result<void> {
    if (this.props.messageCountAtLastCompression < 0) {
      return Result.fail("[CounselCompressConditions] 마지막 압축 시점 메시지 카운트는 0 이상이어야 합니다");
    }
    if (!isDefined(this.props.counselId)) {
      return Result.fail("[CounselCompressConditions] 상담 ID는 필수입니다");
    }
    return Result.ok();
  }

  public shouldCompressContext(currentMessageCount: number): boolean {
    const nonCompressedCount = currentMessageCount - this.props.messageCountAtLastCompression;
    return nonCompressedCount >= CounselCompressConditions.COMPRESSION_THRESHOLD;
  }

  public markContextCompressed(currentMessageCount: number): void {
    const now = getNowDayjs();
    this.props.messageCountAtLastCompression = currentMessageCount;
    this.props.lastMessageCompressedAt = now;
    this.props.updatedAt = now;
  }

  get messageCountAtLastCompression(): number {
    return this.props.messageCountAtLastCompression;
  }
  get lastMessageCompressedAt(): Dayjs | null {
    return this.props.lastMessageCompressedAt;
  }

  get counselId(): CounselId {
    return this.props.counselId;
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
