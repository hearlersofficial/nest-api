import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface TonePromptsNewProps {
  toneId: UniqueEntityId;
  body: string;
}

export interface TonePromptsProps extends TonePromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class TonePrompts extends AggregateRoot<TonePromptsProps> {
  private constructor(props: TonePromptsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: TonePromptsProps, id: UniqueEntityId): Result<TonePrompts> {
    const tonePrompts = new TonePrompts(props, id);
    const validateResult = tonePrompts.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<TonePrompts>(validateResult.error as string);
    }
    return Result.ok<TonePrompts>(tonePrompts);
  }

  public static createNew(newProps: TonePromptsNewProps): Result<TonePrompts> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
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
    if (this.props.toneId === null || this.props.toneId === undefined) {
      return Result.fail<void>("[TonePrompts] ToneId는 필수입니다");
    }

    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[TonePrompts] body는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[TonePrompts] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[TonePrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get toneId(): UniqueEntityId {
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
