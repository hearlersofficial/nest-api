import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";

import { Dayjs } from "dayjs";

export interface TonesNewProps {
  name: string;
  body: string;
}

export interface TonesProps extends TonesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Tones extends AggregateRoot<TonesProps> {
  private constructor(props: TonesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: TonesProps, id: UniqueEntityId): Result<Tones> {
    const tones = new Tones(props, id);
    const validateResult = tones.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Tones>(validateResult.error as string);
    }
    return Result.ok<Tones>(tones);
  }

  public static createNew(newProps: TonesNewProps): Result<Tones> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdTone = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdTone;
  }

  public update(props: Partial<TonesProps>): void {
    if (isDefined(props.name)) {
      this.props.name = props.name;
    }
    if (isDefined(props.body)) {
      this.props.body = props.body;
    }
    this.props.updatedAt = getNowDayjs();
  }

  validateDomain(): Result<void> {
    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[Tones] 이름은 필수입니다");
    }

    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[Tones] 본문은 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Tones] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Tones] 수정 시간은 필수입니다");
    }
    return Result.ok<void>();
  }

  // Getters
  get name(): string {
    return this.props.name;
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
  public getPrompt(): Result<string> {
    const prompt = `<Tone>\n${this.props.body}`;
    return Result.ok<string>(prompt);
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
