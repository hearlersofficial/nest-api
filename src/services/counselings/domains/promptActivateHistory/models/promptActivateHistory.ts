import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { PromptActivateHistoryId } from "~common/shared-kernel/identifiers/prompt-activate-history.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { Dayjs } from "dayjs";

export interface PromptActivateHistoriesNewProps {
  promptVersionId: PromptVersionId;
  activatedAt: Dayjs;
}

export interface PromptActivateHistoriesProps extends PromptActivateHistoriesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptActivateHistories extends AggregateRoot<PromptActivateHistoriesProps, PromptActivateHistoryId> {
  private constructor(props: PromptActivateHistoriesProps, id: PromptActivateHistoryId) {
    super(props, id);
  }

  public static create(
    props: PromptActivateHistoriesProps,
    id: PromptActivateHistoryId,
  ): Result<PromptActivateHistories> {
    const history = new PromptActivateHistories(props, id);
    const validateResult = history.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptActivateHistories>(validateResult.error as string);
    }
    return Result.ok<PromptActivateHistories>(history);
  }

  public static createNew(newProps: PromptActivateHistoriesNewProps): Result<PromptActivateHistories> {
    const now = getNowDayjs();
    const newId = new PromptActivateHistoryId();
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
      return Result.fail<void>("[PromptActivateHistories] PromptVersionId는 필수입니다");
    }

    // activatedAt 검증
    if (!isDefined(this.props.activatedAt)) {
      return Result.fail<void>("[PromptActivateHistories] ActivatedAt은 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[PromptActivateHistories] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[PromptActivateHistories] 수정 시간은 필수입니다");
    }
    return Result.ok();
  }

  // Getters
  get promptVersionId(): PromptVersionId {
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
