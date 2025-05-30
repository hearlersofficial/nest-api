import { getNowDayjs } from "~common/shared/utils/date";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export interface PromptActivateHistoriesNewProps {
  promptVersionId: UniqueEntityId;
  activatedAt: Dayjs;
}

export interface PromptActivateHistoriesProps extends PromptActivateHistoriesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptActivateHistories extends AggregateRoot<PromptActivateHistoriesProps> {
  private constructor(props: PromptActivateHistoriesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: PromptActivateHistoriesProps, id: UniqueEntityId): Result<PromptActivateHistories> {
    const history = new PromptActivateHistories(props, id);
    const validateResult = history.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptActivateHistories>(validateResult.error as string);
    }
    return Result.ok<PromptActivateHistories>(history);
  }

  public static createNew(newProps: PromptActivateHistoriesNewProps): Result<PromptActivateHistories> {
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
      return Result.fail<void>("[PromptActivateHistories] PromptVersionId는 필수입니다");
    }

    // activatedAt 검증
    if (this.props.activatedAt === null || this.props.activatedAt === undefined) {
      return Result.fail<void>("[PromptActivateHistories] ActivatedAt은 필수입니다");
    }

    // 날짜 검증
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[PromptActivateHistories] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
      return Result.fail<void>("[PromptActivateHistories] 수정 시간은 필수입니다");
    }
    return Result.ok();
  }

  // Getters
  get promptVersionId(): UniqueEntityId {
    return this.props.promptVersionId;
  }

  get activatedAt(): Dayjs {
    return this.props.activatedAt;
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
