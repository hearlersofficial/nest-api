import { getNowDayjs } from "~common/shared/utils/Date.utils";
import { isDefined } from "~common/shared/utils/Validate.utils";
import { DomainEntity } from "~common/shared-kernel/domains/DomainEntity";
import { Result } from "~common/shared-kernel/domains/Result";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { Dayjs } from "dayjs";

export interface BubblesNewProps {
  // NOTE: 버블을 영속화 하기 위해선 상담사 ID가 필요함.
  // 상담사가 늘 모든 버블을 가지고 있진 않지만 AggregateRoot인 상담사가 관리할 수 있게 하기 위함
  question: string;
  responseOption1: string;
  responseOption2: string;
}

export interface BubblesProps extends BubblesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Bubbles extends DomainEntity<BubblesProps> {
  private constructor(props: BubblesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: BubblesProps, id: UniqueEntityId): Result<Bubbles> {
    const bubbles = new Bubbles(props, id);
    const result = bubbles.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<Bubbles>(bubbles);
  }

  public static createNew(newProps: BubblesNewProps): Result<Bubbles> {
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

  public validateDomain(): Result<void> {
    if (!isDefined(this.props.question)) {
      return Result.fail<void>("[Bubbles] 질문은 필수입니다");
    }
    if (!isDefined(this.props.responseOption1)) {
      return Result.fail<void>("[Bubbles] 응답 옵션 1은 필수입니다");
    }
    if (!isDefined(this.props.responseOption2)) {
      return Result.fail<void>("[Bubbles] 응답 옵션 2는 필수입니다");
    }
    return Result.ok();
  }

  public update(
    props: Partial<Pick<BubblesProps, "question" | "responseOption1" | "responseOption2">>,
  ): Result<Bubbles> {
    const { question, responseOption1, responseOption2 } = props;
    this.props.question = isDefined(question) ? question : this.props.question;
    this.props.responseOption1 = isDefined(responseOption1) ? responseOption1 : this.props.responseOption1;
    this.props.responseOption2 = isDefined(responseOption2) ? responseOption2 : this.props.responseOption2;
    this.props.updatedAt = getNowDayjs();
    const result = this.validateDomain();
    if (result.isFailureResult()) {
      return Result.fail(result.error);
    }
    return Result.ok<Bubbles>(this);
  }

  public delete(): Result<Bubbles> {
    this.props.deletedAt = getNowDayjs();
    return Result.ok<Bubbles>(this);
  }

  // Getters
  get question(): string {
    return this.props.question;
  }

  get responseOption1(): string {
    return this.props.responseOption1;
  }

  get responseOption2(): string {
    return this.props.responseOption2;
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
