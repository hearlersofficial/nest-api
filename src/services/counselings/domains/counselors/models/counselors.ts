import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export interface CounselorsNewProps {
  name: string;
  gender: CounselorGender;
  description: string;
  toneId: UniqueEntityId;
  profileImage: string;
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
      return Result.fail<Counselors>(validateResult.error as string);
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

  validateDomain(): Result<void> {
    // name 검증
    if (!isDefined(this.props.name)) {
      return Result.fail("[Counselors] 상담사 이름은 필수입니다");
    }
    if (this.props.name.length < 1 || this.props.name.length > 20) {
      return Result.fail("[Counselors] 상담사 이름은 최소 1자 이상, 최대 20자 이하여야 합니다");
    }

    // gender 검증
    if (!isDefined(this.props.gender)) {
      return Result.fail("[Counselors] 성별은 필수입니다");
    }
    if (
      !Object.values(CounselorGender).includes(this.props.gender) ||
      this.props.gender === CounselorGender.UNSPECIFIED
    ) {
      return Result.fail("[Counselors] 유효하지 않은 성별입니다");
    }

    // description 검증
    if (!isDefined(this.props.description)) {
      return Result.fail("[Counselors] 상담사 소개는 필수입니다");
    }
    if (this.props.description.length < 1 || this.props.description.length > 100) {
      return Result.fail("[Counselors] 상담사 소개는 최소 1자 이상, 최대 100자 이하여야 합니다");
    }

    // toneId 검증
    if (!isDefined(this.props.toneId)) {
      return Result.fail("[Counselors] 톤 ID는 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail("[Counselors] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail("[Counselors] 수정 시간은 필수입니다");
    }

    return Result.ok();
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

  get profileImage(): string {
    return this.props.profileImage;
  }

  get toneId(): UniqueEntityId {
    return this.props.toneId;
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
  public update(
    props: Partial<Pick<CounselorsProps, "toneId" | "name" | "description" | "gender" | "profileImage">>,
  ): void {
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
    if (isDefined(props.profileImage)) {
      this.props.profileImage = props.profileImage;
    }
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
