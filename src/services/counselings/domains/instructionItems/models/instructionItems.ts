import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";

import { Dayjs } from "dayjs";

export interface InstructionItemsNewProps {
  body: string;
}

export interface InstructionItemsProps extends InstructionItemsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class InstructionItems extends AggregateRoot<InstructionItemsProps> {
  private constructor(props: InstructionItemsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: InstructionItemsProps, id: UniqueEntityId): Result<InstructionItems> {
    const instructionItems = new InstructionItems(props, id);
    const validateResult = instructionItems.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<InstructionItems>(validateResult.error as string);
    }
    return Result.ok<InstructionItems>(instructionItems);
  }

  public static createNew(newProps: InstructionItemsNewProps): Result<InstructionItems> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdInstructionItem = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdInstructionItem;
  }

  validateDomain(): Result<void> {
    // body 검증
    if (this.props.body === null || this.props.body === undefined) {
      return Result.fail<void>("[InstructionItems] 본문은 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[InstructionItems] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[InstructionItems] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
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
  public update(props: Partial<InstructionItemsProps>): void {
    if (isDefined(props.body) && props.body !== this.props.body) {
      this.props.body = props.body;
    }
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
