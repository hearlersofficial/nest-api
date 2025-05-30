import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface ToneScopedPromptsNewProps {
  promptVersionId: UniqueEntityId;
  toneId: UniqueEntityId;
  tonePromptId: UniqueEntityId | null;
  firstCounselTechniqueId: UniqueEntityId | null;
}

export interface ToneScopedPromptsProps extends ToneScopedPromptsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class ToneScopedPrompts extends DomainEntity<ToneScopedPromptsProps> {
  private constructor(props: ToneScopedPromptsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: ToneScopedPromptsProps, id: UniqueEntityId): Result<ToneScopedPrompts> {
    const toneScopedPrompt = new ToneScopedPrompts(props, id);
    const validateResult = toneScopedPrompt.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<ToneScopedPrompts>(validateResult.error as string);
    }
    return Result.ok<ToneScopedPrompts>(toneScopedPrompt);
  }

  public static createNew(newProps: ToneScopedPromptsNewProps): Result<ToneScopedPrompts> {
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
      return Result.fail<void>("[ToneScopedPrompts] PromptVersionId는 필수입니다");
    }

    // toneId 검증
    if (this.props.toneId === null || this.props.toneId === undefined) {
      return Result.fail<void>("[ToneScopedPrompts] ToneId는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[ToneScopedPrompts] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[ToneScopedPrompts] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get promptVersionId(): UniqueEntityId {
    return this.props.promptVersionId;
  }

  get toneId(): UniqueEntityId {
    return this.props.toneId;
  }

  get tonePromptId(): UniqueEntityId | null {
    return this.props.tonePromptId;
  }

  get firstCounselTechniqueId(): UniqueEntityId | null {
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
