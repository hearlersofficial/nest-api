import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface ContextsNewProps {
  placeholders: string[];
  body: string;
}

export interface ContextsProps extends ContextsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Contexts extends AggregateRoot<ContextsProps> {
  private constructor(props: ContextsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: ContextsProps, id: UniqueEntityId): Result<Contexts> {
    const contexts = new Contexts(props, id);
    const validateResult = contexts.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Contexts>(validateResult.error);
    }
    return Result.ok<Contexts>(contexts);
  }

  public static createNew(newProps: ContextsNewProps): Result<Contexts> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdContext = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdContext;
  }

  validateDomain(): Result<void> {
    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[Contexts] 컨텍스트 본문은 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Counsels] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Counsels] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get placeholders(): string[] {
    return this.props.placeholders;
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
