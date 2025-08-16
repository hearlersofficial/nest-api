import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { ToneScopedPromptId } from "~common/shared-kernel/identifiers/tone-scoped-prompt.id";
import { Dayjs } from "dayjs";

export interface ToneScopedPromptsNewProps {
  promptVersionId: PromptVersionId;
  toneId: ToneId;
  tonePromptId: TonePromptId | null;
  firstCounselTechniqueId: CounselTechniqueId | null;
}

export interface ToneScopedPromptsProps extends ToneScopedPromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class ToneScopedPrompts extends DomainEntity<ToneScopedPromptsProps, ToneScopedPromptId> {
  private constructor(props: ToneScopedPromptsProps, id: ToneScopedPromptId) {
    super(props, id);
  }

  public static create(props: ToneScopedPromptsProps, id: ToneScopedPromptId): Result<ToneScopedPrompts> {
    const toneScopedPrompt = new ToneScopedPrompts(props, id);
    const validateResult = toneScopedPrompt.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<ToneScopedPrompts>(validateResult.error as string);
    }
    return Result.ok<ToneScopedPrompts>(toneScopedPrompt);
  }

  public static createNew(newProps: ToneScopedPromptsNewProps): Result<ToneScopedPrompts> {
    const now = getNowDayjs();
    const newId = new ToneScopedPromptId();
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
      return Result.fail<void>("[ToneScopedPrompts] PromptVersionId는 필수입니다");
    }

    // toneId 검증
    if (!isDefined(this.props.toneId)) {
      return Result.fail<void>("[ToneScopedPrompts] ToneId는 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[ToneScopedPrompts] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[ToneScopedPrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get promptVersionId(): PromptVersionId {
    return this.props.promptVersionId;
  }

  get toneId(): ToneId {
    return this.props.toneId;
  }

  get tonePromptId(): TonePromptId | null {
    return this.props.tonePromptId;
  }

  get firstCounselTechniqueId(): CounselTechniqueId | null {
    return this.props.firstCounselTechniqueId;
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

  public update(props: Partial<ToneScopedPromptsProps>): void {
    if (props.tonePromptId !== undefined && props.tonePromptId !== this.props.tonePromptId) {
      this.props.tonePromptId = props.tonePromptId;
    }
    if (
      props.firstCounselTechniqueId !== undefined &&
      props.firstCounselTechniqueId !== this.props.firstCounselTechniqueId
    ) {
      this.props.firstCounselTechniqueId = props.firstCounselTechniqueId;
    }
    this.props.updatedAt = getNowDayjs();
  }
}
