import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Dayjs } from "dayjs";

export interface CompressedContextNewProps {
  counselId: CounselId;
  content: string;
  messageCountAtCompression: number;
}

export interface CompressedContextProps extends CompressedContextNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CompressedContexts extends AggregateRoot<CompressedContextProps, CompressedContextId> {
  private constructor(props: CompressedContextProps, id: CompressedContextId) {
    super(props, id);
  }

  public static create(props: CompressedContextProps, id: CompressedContextId): Result<CompressedContexts> {
    const compressedContext = new CompressedContexts(props, id);
    const validateResult = compressedContext.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CompressedContexts>(validateResult.error as string);
    }
    return Result.ok<CompressedContexts>(compressedContext);
  }

  public static createNew(newProps: CompressedContextNewProps): Result<CompressedContexts> {
    const now = getNowDayjs();
    const newId = new CompressedContextId();
    return this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  validateDomain(): Result<void> {
    // counselId 검증
    if (!isDefined(this.props.counselId)) {
      return Result.fail("[CompressedContext] 상담 ID는 필수입니다.");
    }

    // content 검증
    if (!isDefined(this.props.content) || this.props.content.trim() === "") {
      return Result.fail("[CompressedContext] 내용은 필수입니다.");
    }

    // messageCountAtCompression 검증
    if (this.props.messageCountAtCompression < 0) {
      return Result.fail("[CompressedContext] 압축 시 메시지 수는 0 이상이어야 합니다.");
    }
    if (!Number.isInteger(this.props.messageCountAtCompression)) {
      return Result.fail("[CompressedContext] 압축 시 메시지 수는 정수여야 합니다.");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail("[CompressedContext] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail("[CompressedContext] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get counselId(): CounselId {
    return this.props.counselId;
  }

  get content(): string {
    return this.props.content;
  }

  get messageCountAtCompression(): number {
    return this.props.messageCountAtCompression;
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

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
