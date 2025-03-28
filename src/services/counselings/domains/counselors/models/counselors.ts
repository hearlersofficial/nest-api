import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { Bubble, BubbleList } from "~counselings/domains/counselors/models/const/bubble.const";
import { Personas } from "~counselings/domains/counselors/models/personas";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Dayjs } from "dayjs";

export interface CounselorsNewProps {
  name: string;
  gender: CounselorGender;
  description: string;
  toneId: UniqueEntityId;
}

export interface CounselorsProps extends CounselorsNewProps {
  persona: Personas;
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
        // 기본 Persona 생성
        persona: Personas.createNew({
          body: "This is an automatically set persona. Modification is required.",
          counselorId: newId,
        }).value,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  validateDomain(): Result<void> {
    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[Counselors] 상담사 이름은 필수입니다");
    }
    if (this.props.name.length < 1) {
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
    if (this.props.description.length < 1) {
      return Result.fail<void>("[Counselors] 상담사 소개는 최소 1자 이상이어야 합니다");
    }

    // toneId 검증
    if (this.props.toneId === null || this.props.toneId === undefined) {
      return Result.fail<void>("[Counselors] 톤 ID는 필수입니다");
    }

    // Personas 검증
    const personaValidateResult = this.props.persona.validateDomain();
    if (personaValidateResult.isFailure) {
      return Result.fail<void>(personaValidateResult.error as string);
    }
    if (!this.props.persona.counselorId.equals(this.id)) {
      return Result.fail<void>("[Counselors] Persona의 상담사 ID가 일치하지 않습니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Counselors] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Counselors] 수정 시간은 필수입니다");
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

  get persona(): Personas {
    return this.props.persona;
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

  public updatePersona(body: string): void {
    this.props.persona.update({ body });
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
