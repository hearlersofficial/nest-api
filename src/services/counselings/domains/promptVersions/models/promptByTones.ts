import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface PromptByTonesNewProps {
  promptVersionId: UniqueEntityId;
  toneId: UniqueEntityId;
  tonePromptId: UniqueEntityId | null;
  firstCounselTechniqueId: UniqueEntityId | null;
}

export interface PromptByTonesProps extends PromptByTonesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptByTones extends DomainEntity<PromptByTonesProps> {
  private constructor(props: PromptByTonesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: PromptByTonesProps, id: UniqueEntityId): Result<PromptByTones> {
    const promptByTones = new PromptByTones(props, id);
    const validateResult = promptByTones.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptByTones>(validateResult.error as string);
    }
    return Result.ok<PromptByTones>(promptByTones);
  }

  public static createNew(newProps: PromptByTonesNewProps): Result<PromptByTones> {
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
      return Result.fail<void>("[PromptByTones] PromptVersionId는 필수입니다");
    }

    // toneId 검증
    if (this.props.toneId === null || this.props.toneId === undefined) {
      return Result.fail<void>("[PromptByTones] ToneId는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[PromptByTones] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[PromptByTones] 수정 시간은 필수입니다");
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

  public update(props: Partial<PromptByTonesProps>): void {
    if (props.tonePromptId !== undefined && props.tonePromptId !== this.props.tonePromptId) {
      this.props.tonePromptId = props.tonePromptId;
    }
    if (props.firstCounselTechniqueId !== undefined && props.firstCounselTechniqueId !== this.props.firstCounselTechniqueId) {
      this.props.firstCounselTechniqueId = props.firstCounselTechniqueId;
    }
    this.props.updatedAt = getNowDayjs();
  }
}
