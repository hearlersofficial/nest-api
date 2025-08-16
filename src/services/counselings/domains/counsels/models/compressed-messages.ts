import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Dayjs } from "dayjs";

export interface CompressedMessagesNewProps {
  counselId: CounselId;
  content: string;
  messageCountAtCompression: number;
}

export interface CompressedMessagesProps extends CompressedMessagesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CompressedMessages extends DomainEntity<CompressedMessagesProps, CompressedMessageId> {
  private constructor(props: CompressedMessagesProps, id: CompressedMessageId) {
    super(props, id);
  }

  public static create(props: CompressedMessagesProps, id: CompressedMessageId): Result<CompressedMessages> {
    const compressedMessage = new CompressedMessages(props, id);
    const validateResult = compressedMessage.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CompressedMessages>(validateResult.error as string);
    }
    return Result.ok<CompressedMessages>(compressedMessage);
  }

  public static createNew(newProps: CompressedMessagesNewProps): Result<CompressedMessages> {
    const now = getNowDayjs();
    const newId = new CompressedMessageId();
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
      return Result.fail("[CompressedMessage] 상담 ID는 필수입니다.");
    }

    // content 검증
    if (!isDefined(this.props.content) || this.props.content.trim() === "") {
      return Result.fail("[CompressedMessage] 내용은 필수입니다.");
    }

    // messageCountAtCompression 검증
    if (this.props.messageCountAtCompression < 0) {
      return Result.fail("[CompressedMessage] 압축 시 메시지 수는 0 이상이어야 합니다.");
    }
    if (!Number.isInteger(this.props.messageCountAtCompression)) {
      return Result.fail("[CompressedMessage] 압축 시 메시지 수는 정수여야 합니다.");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail("[CompressedMessage] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail("[CompressedMessage] 수정 시간은 필수입니다");
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
