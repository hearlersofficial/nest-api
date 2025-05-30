import { getNowDayjs } from "~common/shared/utils/date";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export interface CounselorScopedPromptsNewProps {
  promptVersionId: UniqueEntityId;
  counselorId: UniqueEntityId;
  personaPromptId: UniqueEntityId;
}

export interface CounselorScopedPromptsProps extends CounselorScopedPromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselorScopedPrompts extends DomainEntity<CounselorScopedPromptsProps> {
  private constructor(props: CounselorScopedPromptsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselorScopedPromptsProps, id: UniqueEntityId): Result<CounselorScopedPrompts> {
    const counselorScopedPrompt = new CounselorScopedPrompts(props, id);
    const validateResult = counselorScopedPrompt.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselorScopedPrompts>(validateResult.error as string);
    }
    return Result.ok<CounselorScopedPrompts>(counselorScopedPrompt);
  }

  public static createNew(newProps: CounselorScopedPromptsNewProps): Result<CounselorScopedPrompts> {
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
    // promptVersionId 검증
    if (this.props.promptVersionId === null || this.props.promptVersionId === undefined) {
      return Result.fail<void>("[CounselorScopedPrompts] PromptVersionId는 필수입니다");
    }

    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail<void>("[CounselorScopedPrompts] CounselorId는 필수입니다");
    }

    // personaPromptId 검증
    if (this.props.personaPromptId === null || this.props.personaPromptId === undefined) {
      return Result.fail<void>("[CounselorScopedPrompts] PersonaPromptId는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[CounselorScopedPrompts] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[CounselorScopedPrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get promptVersionId(): UniqueEntityId {
    return this.props.promptVersionId;
  }

  get counselorId(): UniqueEntityId {
    return this.props.counselorId;
  }

  get personaPromptId(): UniqueEntityId {
    return this.props.personaPromptId;
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

  public update(props: Partial<CounselorScopedPromptsProps>): void {
    if (props.personaPromptId !== undefined && props.personaPromptId !== this.props.personaPromptId) {
      this.props.personaPromptId = props.personaPromptId;
    }
    this.props.updatedAt = getNowDayjs();
  }
}
