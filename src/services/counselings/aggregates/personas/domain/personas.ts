import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface PersonasNewProps {
  body: string;
  counselorId: UniqueEntityId;
}

export interface PersonasProps extends PersonasNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Personas extends AggregateRoot<PersonasProps> {
  private constructor(props: PersonasProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: PersonasProps, id: UniqueEntityId): Result<Personas> {
    const personas = new Personas(props, id);
    const validateResult = personas.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Personas>(validateResult.error);
    }
    return Result.ok<Personas>(personas);
  }

  public static createNew(newProps: PersonasNewProps): Result<Personas> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdPersona = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdPersona;
  }

  validateDomain(): Result<void> {
    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail<void>("[Personas] 상담사 ID는 필수입니다");
    }

    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[Personas] 내용은 필수입니다");
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
  get body(): string {
    return this.props.body;
  }

  get counselorId(): UniqueEntityId {
    return this.props.counselorId;
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
    const prompt = `<Persona>\n${this.props.body}`;
    return Result.ok<string>(prompt);
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
