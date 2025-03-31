import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface PromptByCounselorsNewProps {
  promptVersionId: UniqueEntityId;
  counselorId: UniqueEntityId;
  personaPromptId: UniqueEntityId;
}

export interface PromptByCounselorsProps extends PromptByCounselorsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptByCounselors extends DomainEntity<PromptByCounselorsProps> {
  private constructor(props: PromptByCounselorsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: PromptByCounselorsProps, id: UniqueEntityId): Result<PromptByCounselors> {
    const promptByCounselors = new PromptByCounselors(props, id);
    const validateResult = promptByCounselors.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptByCounselors>(validateResult.error as string);
    }
    return Result.ok<PromptByCounselors>(promptByCounselors);
  }

  public static createNew(newProps: PromptByCounselorsNewProps): Result<PromptByCounselors> {
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
      return Result.fail<void>("[PromptByCounselors] PromptVersionId는 필수입니다");
    }

    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail<void>("[PromptByCounselors] CounselorId는 필수입니다");
    }

    // personaPromptId 검증
    if (this.props.personaPromptId === null || this.props.personaPromptId === undefined) {
      return Result.fail<void>("[PromptByCounselors] PersonaPromptId는 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[PromptByCounselors] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[PromptByCounselors] 수정 시간은 필수입니다");
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

  public update(props: Partial<PromptByCounselorsProps>): void {
    if (props.personaPromptId !== undefined && props.personaPromptId !== this.props.personaPromptId) {
      this.props.personaPromptId = props.personaPromptId;
    }
    this.props.updatedAt = getNowDayjs();
  }
}
