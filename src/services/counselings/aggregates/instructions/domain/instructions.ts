import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { InstructionMaps } from "~counselings/aggregates/instructions/domain/instructionMaps";

import { Dayjs } from "dayjs";

export interface InstructionsNewProps {
  initialSentence: string | null;
  instructionMaps: InstructionMaps[];
}

export interface InstructionsProps extends InstructionsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Instructions extends AggregateRoot<InstructionsProps> {
  private constructor(props: InstructionsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: InstructionsProps, id: UniqueEntityId): Result<Instructions> {
    const instructions = new Instructions(props, id);
    const validateResult = instructions.validateDomain();

    if (validateResult.isFailure) {
      return Result.fail<Instructions>(validateResult.error);
    }

    return Result.ok<Instructions>(instructions);
  }

  public static createNew(newProps: InstructionsNewProps): Result<Instructions> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdInstruction = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdInstruction;
  }

  private validateDomain(): Result<void> {
    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Counsels] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Counsels] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get initialSentence(): string | null {
    return this.props.initialSentence;
  }

  get instructionMaps(): InstructionMaps[] {
    return this.props.instructionMaps;
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
