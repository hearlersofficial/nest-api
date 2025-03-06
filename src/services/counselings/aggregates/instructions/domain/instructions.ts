import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { InstructionMaps } from "~counselings/aggregates/instructions/domain/instructionMaps";

import { Dayjs } from "dayjs";

export interface InstructionsNewProps {
  name: string;
  initialSentence: string | null;
}

export interface InstructionsProps extends InstructionsNewProps {
  instructionMaps: InstructionMaps[];
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
        instructionMaps: [],
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdInstruction;
  }

  private validateDomain(): Result<void> {
    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[Instructions] 이름은 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Instructions] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Instructions] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

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
  public updateInstructionMaps(instructionItemIds: UniqueEntityId[]): Result<void> {
    const currentInstructionLength = this.props.instructionMaps.length;
    const newInstructionLength = instructionItemIds.length;

    // 업데이트할 항목의 길이만큼 반복
    for (let i = 0; i < Math.min(currentInstructionLength, newInstructionLength); i++) {
      this.props.instructionMaps[i].updateInstructionItemId(instructionItemIds[i]);
    }

    // 초과된 기존 항목 삭제
    if (currentInstructionLength > newInstructionLength) {
      for (let i = newInstructionLength; i < currentInstructionLength; i++) {
        this.props.instructionMaps[i].delete();
      }
    }
    // 부족한 새로운 항목 추가
    else if (newInstructionLength > currentInstructionLength) {
      for (let i = currentInstructionLength; i < newInstructionLength; i++) {
        const newInstructionMapResult = InstructionMaps.createNew({
          sequence: i + 1,
          instructionItemId: instructionItemIds[i],
          instructionId: this.id,
        });
        if (newInstructionMapResult.isFailure) {
          return Result.fail<void>(newInstructionMapResult.error);
        }
        this.props.instructionMaps.push(newInstructionMapResult.value);
      }
    }

    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public getPrompt(instructionItems: InstructionItems[]): Result<string> {
    let prompt = this.initialSentence ? this.initialSentence : "";
    const instructionMaps = this.props.instructionMaps.sort((a, b) => a.sequence - b.sequence);

    instructionMaps.forEach((map, index) => {
      const instructionItem = instructionItems.find((item) => item.id.equals(map.instructionItemId));
      if (instructionItem) {
        prompt += `\n${index + 1}. ${instructionItem.body}`;
      } else {
        return Result.fail<string>("[Instructions] 지시사항 아이템을 찾을 수 없습니다");
      }
    });

    prompt = `<Instruction>\n${prompt}`;
    return Result.ok<string>(prompt);
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
