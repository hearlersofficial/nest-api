import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { Bubble, BubbleList } from "~counselings/aggregates/counselors/domain/consts/Bubble.const";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Dayjs } from "dayjs";

export interface CounselorsNewProps {
  name: string;
  gender: CounselorGender;
  description: string;
  toneId: UniqueEntityId;
}

export interface CounselorsProps extends CounselorsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Counselors extends AggregateRoot<CounselorsProps> {
  private constructor(props: CounselorsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselorsProps, id: UniqueEntityId): Result<Counselors> {
    const counselors = new Counselors(props, id);
    const validateResult = counselors.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Counselors>(validateResult.error);
    }
    return Result.ok<Counselors>(counselors);
  }

  public static createNew(newProps: CounselorsNewProps): Result<Counselors> {
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

  public update(props: Partial<CounselorsProps>): void {
    if (isDefined(props.toneId)) {
      this.props.toneId = props.toneId;
    }
    if (isDefined(props.name)) {
      this.props.name = props.name;
    }
    if (isDefined(props.description)) {
      this.props.description = props.description;
    }
    if (isDefined(props.gender)) {
      this.props.gender = props.gender;
    }
    this.props.updatedAt = getNowDayjs();
  }

  validateDomain(): Result<void> {
    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[Counselors] 상담사 이름은 필수입니다");
    }
    if (this.props.name.length === 0) {
      return Result.fail<void>("[Counselors] 상담사 이름은 최소 1자 이상이어야 합니다");
    }

    // gender 검증
    if (this.props.gender === null || this.props.gender === undefined) {
      return Result.fail<void>("[Counselors] 성별은 필수입니다");
    }
    if (!Object.values(CounselorGender).includes(this.props.gender)) {
      return Result.fail<void>("[Counselors] 유효하지 않은 성별입니다");
    }
    if (this.props.gender === CounselorGender.UNSPECIFIED) {
      return Result.fail<void>("[Counselors] 성별이 지정되지 않았습니다");
    }

    // description 검증
    if (this.props.description === null || this.props.description === undefined) {
      return Result.fail<void>("[Counselors] 상담사 소개는 필수입니다");
    }
    if (this.props.description.length === 0) {
      return Result.fail<void>("[Counselors] 상담사 소개는 최소 1자 이상이어야 합니다");
    }

    // toneId 검증
    if (this.props.toneId === null || this.props.toneId === undefined) {
      return Result.fail<void>("[Counselors] 톤 ID는 필수입니다");
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
  get name(): string {
    return this.props.name;
  }

  get gender(): CounselorGender {
    return this.props.gender;
  }

  get description(): string {
    return this.props.description;
  }

  get toneId(): UniqueEntityId {
    return this.props.toneId;
  }

  get bubble(): Bubble {
    const bubble = BubbleList[Math.floor(Math.random() * BubbleList.length)];
    return bubble;
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
