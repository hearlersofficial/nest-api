import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorScopedPromptId } from "~common/shared-kernel/identifiers/counselor-scoped-prompt.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export interface CounselorScopedPromptsNewProps {
  promptVersionId: PromptVersionId;
  counselorId: CounselorId;
  personaPromptId: PersonaPromptId;
}

export interface CounselorScopedPromptsProps extends CounselorScopedPromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselorScopedPrompts extends DomainEntity<CounselorScopedPromptsProps, CounselorScopedPromptId> {
  private constructor(props: CounselorScopedPromptsProps, id: CounselorScopedPromptId) {
    super(props, id);
  }

  public static create(
    props: CounselorScopedPromptsProps,
    id: CounselorScopedPromptId,
  ): Result<CounselorScopedPrompts> {
    const counselorScopedPrompt = new CounselorScopedPrompts(props, id);
    const validateResult = counselorScopedPrompt.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselorScopedPrompts>(validateResult.error as string);
    }
    return Result.ok<CounselorScopedPrompts>(counselorScopedPrompt);
  }

  public static createNew(newProps: CounselorScopedPromptsNewProps): Result<CounselorScopedPrompts> {
    const now = getNowDayjs();
    const newId = new CounselorScopedPromptId();
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
    if (!isDefined(this.props.promptVersionId)) {
      return Result.fail<void>("[CounselorScopedPrompts] PromptVersionId는 필수입니다");
    }

    // counselorId 검증
    if (!isDefined(this.props.counselorId)) {
      return Result.fail<void>("[CounselorScopedPrompts] CounselorId는 필수입니다");
    }

    // personaPromptId 검증
    if (!isDefined(this.props.personaPromptId)) {
      return Result.fail<void>("[CounselorScopedPrompts] PersonaPromptId는 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[CounselorScopedPrompts] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[CounselorScopedPrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get promptVersionId(): PromptVersionId {
    return this.props.promptVersionId;
  }

  get counselorId(): CounselorId {
    return this.props.counselorId;
  }

  get personaPromptId(): PersonaPromptId {
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
