import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { Dayjs } from "dayjs";

export interface TonesNewProps {
  name: string;
  description: string;
}

export interface TonesProps extends TonesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Tones extends AggregateRoot<TonesProps, ToneId> {
  private constructor(props: TonesProps, id: ToneId) {
    super(props, id);
  }

  public static create(props: TonesProps, id: ToneId): Result<Tones> {
    const tones = new Tones(props, id);
    const validateResult = tones.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Tones>(validateResult.error as string);
    }
    return Result.ok<Tones>(tones);
  }

  public static createNew(newProps: TonesNewProps): Result<Tones> {
    const now = getNowDayjs();
    const newId = new ToneId();
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
    if (isDefined(props.description)) {
      this.props.description = props.description;
    }
    this.props.updatedAt = getNowDayjs();
  }

  validateDomain(): Result<void> {
    // name 검증
    if (!isDefined(this.props.name)) {
      return Result.fail<void>("[Tones] 이름은 필수입니다");
    }

    // description 검증
    if (!isDefined(this.props.description)) {
      return Result.fail<void>("[Tones] 설명은 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[Tones] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[Tones] 수정 시간은 필수입니다");
    }
    return Result.ok();
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
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
