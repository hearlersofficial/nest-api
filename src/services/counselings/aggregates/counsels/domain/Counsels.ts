import { CounselCreatedPayloadSchema } from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { AggregateRoot } from "~/src/shared/core/domain/AggregateRoot";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { CounselStage } from "~/src/shared/enums/CounselStage.enum";
import { formatDayjs, getNowDayjs } from "~/src/shared/utils/Date.utils";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CounselCreatedEvent } from "~counselings/aggregates/counsels/domain/events/CounselCreatedEvents";

import { create } from "@bufbuild/protobuf";
import { Dayjs } from "dayjs";

interface CounselsNewProps {
  counselorId: number;
  userId: number;
}

interface CounselsProps extends CounselsNewProps {
  counselStage: CounselStage;
  lastChatedAt: Dayjs | null;
  lastMessage: string | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Counsels extends AggregateRoot<CounselsProps> {
  private constructor(props: CounselsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselsProps, id: UniqueEntityId): Result<Counsels> {
    const counsels = new Counsels(props, id);
    const validateResult = counsels.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Counsels>(validateResult.error);
    }
    return Result.ok<Counsels>(counsels);
  }

  public static createNew(newProps: CounselsNewProps): Result<Counsels> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdCounsel = this.create(
      {
        ...newProps,
        counselStage: CounselStage.SMALL_TALK,
        lastChatedAt: null,
        lastMessage: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdCounsel;
  }

  validateDomain(): Result<void> {
    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail<void>("[Counsels] 상담사 ID는 필수입니다");
    }

    // userId 검증
    if (this.props.userId === null || this.props.userId === undefined) {
      return Result.fail<void>("[Counsels] 사용자 ID는 필수입니다");
    }

    // counselStage 검증
    if (this.props.counselStage === null || this.props.counselStage === undefined) {
      return Result.fail<void>("[Counsels] 상담 단계는 필수입니다");
    }
    if (!Object.values(CounselStage).includes(this.props.counselStage)) {
      return Result.fail<void>("[Counsels] 유효하지 않은 상담 단계입니다");
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
  get counselorId(): number {
    return this.props.counselorId;
  }

  get userId(): number {
    return this.props.userId;
  }

  get counselStage(): CounselStage {
    return this.props.counselStage;
  }

  get lastChatedAt(): Dayjs | null {
    return this.props.lastChatedAt;
  }

  get lastMessage(): string | null {
    return this.props.lastMessage;
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
  public updateCounselStage(counselStage: CounselStage): Result<void> {
    this.props.counselStage = counselStage;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public saveLastMessage(counselMessage: CounselMessages): Result<void> {
    if (!counselMessage.counselId.equals(this.id)) {
      return Result.fail<void>("[Counsels] 메시지의 상담 ID가 일치하지 않습니다");
    }
    this.props.lastMessage = counselMessage.message;
    this.props.lastChatedAt = counselMessage.createdAt;
    return Result.ok<void>();
  }

  public checkNeedStageReset(): boolean {
    const lastChatedAt = this.props.lastChatedAt;
    if (!lastChatedAt) {
      return false;
    }
    const now = getNowDayjs();
    return now.isAfter(lastChatedAt.add(6, "hour"));
  }

  public addCreatedEvent(): void {
    const counselCreated = create(CounselCreatedPayloadSchema, {
      counselId: this.id.getNumber(),
      userId: this.userId,
      counselorId: this.counselorId,
      occurredAt: formatDayjs(getNowDayjs()),
    });
    this.addDomainEvent(new CounselCreatedEvent(counselCreated));
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
