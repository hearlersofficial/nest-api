import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { Dayjs } from "dayjs";

export interface TonePromptsNewProps {
  toneId: ToneId;
  body: string;
}

export interface TonePromptsProps extends TonePromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class TonePrompts extends AggregateRoot<TonePromptsProps, TonePromptId> {
  private constructor(props: TonePromptsProps, id: TonePromptId) {
    super(props, id);
  }

  public static create(props: TonePromptsProps, id: TonePromptId): Result<TonePrompts> {
    const tonePrompts = new TonePrompts(props, id);
    const validateResult = tonePrompts.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<TonePrompts>(validateResult.error as string);
    }
    return Result.ok<TonePrompts>(tonePrompts);
  }

  public static createNew(newProps: TonePromptsNewProps): Result<TonePrompts> {
    const now = getNowDayjs();
    const newId = new TonePromptId();
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
    // toneId 검증
    if (!isDefined(this.props.toneId)) {
      return Result.fail<void>("[TonePrompts] ToneId는 필수입니다");
    }

    // body 검증
    if (!isDefined(this.props.body)) {
      return Result.fail<void>("[TonePrompts] body는 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[TonePrompts] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[TonePrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  update(updateProps: Partial<Pick<TonePromptsNewProps, "body">>): void {
    this.props.body = updateProps.body ?? this.props.body;
    this.props.updatedAt = getNowDayjs();
  }

  // Getters
  get toneId(): ToneId {
    return this.props.toneId;
  }

  get body(): string {
    return this.props.body;
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
  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
