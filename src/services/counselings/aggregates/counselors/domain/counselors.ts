import { CounselorGender, CounselorType, CounselPromptType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { AggregateRoot } from "~/src/shared/core/domain/AggregateRoot";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { CounselStage } from "~/src/shared/enums/CounselStage.enum";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";

import { Bubble, BubbleList } from "./consts/Bubble.const";
import { Dayjs } from "dayjs";

interface CounselorsNewProps {
  counselorType: CounselorType;
  name: string;
  gender: CounselorGender;
  description: string;
}

export interface CounselorsProps extends CounselorsNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Counselors extends AggregateRoot<CounselorsProps> {
  private constructor(props: CounselorsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselorsProps, id: UniqueEntityId): Result<Counselors> {
    const counselors = new Counselors(props, id);
    const validateResult = counselors.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Counselors>(validateResult.error);
    }
    return Result.ok<Counselors>(counselors);
  }

  public static createNew(newProps: CounselorsNewProps): Result<Counselors> {
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
    // counselorType 검증
    if (this.props.counselorType === null || this.props.counselorType === undefined) {
      return Result.fail<void>("[Counselors] 상담사 타입은 필수입니다");
    }
    if (!Object.values(CounselorType).includes(this.props.counselorType)) {
      return Result.fail<void>("[Counselors] 유효하지 않은 상담사 타입입니다");
    }
    if (this.props.counselorType === CounselorType.UNSPECIFIED) {
      return Result.fail<void>("[Counselors] 상담사 타입이 지정되지 않았습니다");
    }

    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[Counselors] 상담사 이름은 필수입니다");
    }
    if (this.props.name.length === 0) {
      return Result.fail<void>("[Counselors] 상담사 이름은 최소 1자 이상이어야 합니다");
    }

    // gender 검증
    if (this.props.gender === null || this.props.gender === undefined) {
      return Result.fail<void>("[Counselors] 성별은 필수입니다");
    }
    if (!Object.values(CounselorGender).includes(this.props.gender)) {
      return Result.fail<void>("[Counselors] 유효하지 않은 성별입니다");
    }
    if (this.props.gender === CounselorGender.UNSPECIFIED) {
      return Result.fail<void>("[Counselors] 성별이 지정되지 않았습니다");
    }

    // description 검증
    if (this.props.description === null || this.props.description === undefined) {
      return Result.fail<void>("[Counselors] 상담사 소개는 필수입니다");
    }
    if (this.props.description.length === 0) {
      return Result.fail<void>("[Counselors] 상담사 소개는 최소 1자 이상이어야 합니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Counsels] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Counsels] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get counselorType(): CounselorType {
    return this.props.counselorType;
  }

  get name(): string {
    return this.props.name;
  }

  get gender(): CounselorGender {
    return this.props.gender;
  }

  get description(): string {
    return this.props.description;
  }

  get bubble(): Bubble {
    const bubble = BubbleList[Math.floor(Math.random() * BubbleList.length)];
    return bubble;
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

  public decideSystemPrompt(stage: CounselStage): CounselPromptType {
    if (stage == CounselStage.SMALL_TALK) {
      return CounselPromptType.SYSTEM_MSG;
    }
    if (stage == CounselStage.POSITIVE) {
      return CounselPromptType.POSITIVE_MSG;
    }
    const type = this.props.counselorType;
    if (stage == CounselStage.NEGATIVE_WITH_REASON) {
      if (type == CounselorType.DEPRESSED) {
        return CounselPromptType.DEPRESSED_REASON_MSG;
      }
      if (type == CounselorType.ANXIOUS) {
        return CounselPromptType.ANXIOUS_REASON_MSG;
      }
      if (type == CounselorType.TIRED) {
        return CounselPromptType.TIRED_REASON_MSG;
      }
    }
    if (stage == CounselStage.NEGATIVE_WITHOUT_REASON) {
      if (type == CounselorType.DEPRESSED) {
        return CounselPromptType.DEPRESSED_NO_REASON_MSG;
      }
      if (type == CounselorType.ANXIOUS) {
        return CounselPromptType.ANXIOUS_NO_REASON_MSG;
      }
      if (type == CounselorType.TIRED) {
        return CounselPromptType.TIRED_NO_REASON_MSG;
      }
    }
    if (stage == CounselStage.EXTREME) {
      return CounselPromptType.WHY_LIVE_MSG;
    }
  }
}
