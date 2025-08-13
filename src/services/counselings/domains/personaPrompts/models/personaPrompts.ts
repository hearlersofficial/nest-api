import { getNowDayjs } from "~common/shared/utils/date";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { Dayjs } from "dayjs";

export interface PersonaPromptsNewProps {
  counselorId: CounselorId;
  body: string;
}

export interface PersonaPromptsProps extends PersonaPromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PersonaPrompts extends AggregateRoot<PersonaPromptsProps, PersonaPromptId> {
  private constructor(props: PersonaPromptsProps, id: PersonaPromptId) {
    super(props, id);
  }

  public static create(props: PersonaPromptsProps, id: PersonaPromptId): Result<PersonaPrompts> {
    const personaPrompts = new PersonaPrompts(props, id);
    const validateResult = personaPrompts.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PersonaPrompts>(validateResult.error as string);
    }
    return Result.ok<PersonaPrompts>(personaPrompts);
  }

  public static createNew(newProps: PersonaPromptsNewProps): Result<PersonaPrompts> {
    const now = getNowDayjs();
    const newId = new PersonaPromptId();
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
    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail<void>("[PersonaPrompts] counselorId는 필수입니다");
    }

    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[PersonaPrompts] body는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[PersonaPrompts] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[PersonaPrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get counselorId(): CounselorId {
    return this.props.counselorId;
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
