import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Dayjs } from "dayjs";

export interface InstructionMapsNewProps {
  sequence: number;
  instructionItemId: UniqueEntityId;
  instructionId: UniqueEntityId;
}

export interface InstructionMapsProps extends InstructionMapsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class InstructionMaps extends DomainEntity<InstructionMapsProps> {
  private constructor(props: InstructionMapsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: InstructionMapsProps, id?: UniqueEntityId): Result<InstructionMaps> {
    const instructionMaps = new InstructionMaps(props, id);
    const validateResult = instructionMaps.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<InstructionMaps>(validateResult.error);
    }

    return Result.ok<InstructionMaps>(instructionMaps);
  }

  public static createNew(newProps: InstructionMapsNewProps): Result<InstructionMaps> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdInstructionMaps = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdInstructionMaps;
  }

  validateDomain(): Result<void> {
    // sequence 검증
    if (this.props.sequence === null || this.props.sequence === undefined) {
      return Result.fail<void>("[InstructionMaps] 순서는 필수입니다");
    }
    if (this.props.sequence < 1) {
      return Result.fail<void>("[InstructionMaps] 순서는 1 이상이어야 합니다");
    }
    if (!Number.isInteger(this.props.sequence)) {
      return Result.fail<void>("[InstructionMaps] 순서는 정수여야 합니다");
    }

    // instructionItemId 검증
    if (this.props.instructionItemId === null || this.props.instructionItemId === undefined) {
      return Result.fail<void>("[InstructionMaps] 지시사항 아이템 ID는 필수입니다");
    }

    // instructionId 검증
    if (this.props.instructionId === null || this.props.instructionId === undefined) {
      return Result.fail<void>("[InstructionMaps] 지시사항 ID는 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[InstructionMaps] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[InstructionMaps] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get sequence(): number {
    return this.props.sequence;
  }

  get instructionItemId(): UniqueEntityId {
    return this.props.instructionItemId;
  }

  get instructionId(): UniqueEntityId {
    return this.props.instructionId;
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
  public updateInstructionItemId(instructionItemId: UniqueEntityId): void {
    this.props.instructionItemId = instructionItemId;
    this.props.updatedAt = getNowDayjs();
  }

  public updateSequence(sequence: number): void {
    this.props.sequence = sequence;
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
