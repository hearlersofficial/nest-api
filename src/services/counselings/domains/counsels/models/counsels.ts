import { CounselCreatedEvent } from "~counselings/domains/counsels/events/counsel-created.event";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { CounselCreatedPayloadSchema } from "~proto/com/hearlers/v1/message/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { getNowDayjs } from "~common/shared/utils/date";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { Dayjs } from "dayjs";

export interface CounselsNewProps {
  userId: UniqueEntityId;
  counselorId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  promptVersionId: UniqueEntityId;
  counselorUserRelationshipId: UniqueEntityId;
}

export interface CounselsProps extends CounselsNewProps {
  counselContexts: CounselContexts;
  lastChatedAt: Dayjs | null;
  lastMessage: string | null;

  messageCount: number;

  notCompressedMessageCount: number;
  lastContextCompressedAt: Dayjs | null;
  compressedContextExists: boolean;

  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Counsels extends AggregateRoot<CounselsProps, CounselId> {
  private static readonly COMPRESSION_THRESHOLD = 100;

  private constructor(props: CounselsProps, id: CounselId) {
    super(props, id);
  }

  public static create(props: CounselsProps, id: CounselId): Result<Counsels> {
    const counsels = new Counsels(props, id);
    const validateResult = counsels.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Counsels>(validateResult.error as string);
    }
    return Result.ok<Counsels>(counsels);
  }

  public static createNew(newProps: CounselsNewProps): Result<Counsels> {
    const now = getNowDayjs();
    const newId = new CounselId();
    const counselContexts = CounselContexts.createNew({
      counselId: newId,
    });
    if (counselContexts.isFailureResult()) {
      return Result.fail<Counsels>(counselContexts.error);
    }
    const createdCounsel = this.create(
      {
        ...newProps,
        counselContexts: counselContexts.value,
        lastChatedAt: null,
        lastMessage: null,
        messageCount: 0,
        notCompressedMessageCount: 0,
        lastContextCompressedAt: null,
        compressedContextExists: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    const counselCreated = create(CounselCreatedPayloadSchema, {
      counselId: newId.getString(),
      userId: newProps.userId.getString(),
      counselorId: newProps.counselorId.getString(),
      occurredAt: getNowDayjs().toISOString(),
    });
    createdCounsel.value.addDomainEvent(new CounselCreatedEvent(counselCreated));

    return createdCounsel;
  }

  validateDomain(): Result<void> {
    // counselorId 검증
    if (this.props.counselorId === null || this.props.counselorId === undefined) {
      return Result.fail("[Counsels] 상담사 ID는 필수입니다");
    }

    // counselTechniqueId 검증
    if (this.props.counselTechniqueId === null || this.props.counselTechniqueId === undefined) {
      return Result.fail("[Counsels] 상담 기법 ID는 필수입니다");
    }

    // promptVersionId 검증
    if (this.props.promptVersionId === null || this.props.promptVersionId === undefined) {
      return Result.fail("[Counsels] 프롬프트 버전 ID는 필수입니다");
    }

    // counselorUserRelationshipId 검증
    if (this.props.counselorUserRelationshipId === null || this.props.counselorUserRelationshipId === undefined) {
      return Result.fail("[Counsels] 상담사-사용자 관계 ID는 필수입니다");
    }

    // messageCount 검증
    if (this.props.messageCount < 0) {
      return Result.fail("[Counsels] 메시지 수는 0 이상이어야 합니다.");
    }
    if (!Number.isInteger(this.props.messageCount)) {
      return Result.fail("[Counsels] 메시지 수는 정수여야 합니다.");
    }

    // notCompressedMessageCount 검증
    if (this.props.notCompressedMessageCount < 0) {
      return Result.fail("[Counsels] 압축되지 않은 메시지 수는 0 이상이어야 합니다.");
    }
    if (!Number.isInteger(this.props.notCompressedMessageCount)) {
      return Result.fail("[Counsels] 압축되지 않은 메시지 수는 정수여야 합니다.");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail("[Counsels] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail("[Counsels] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get counselorId(): UniqueEntityId {
    return this.props.counselorId;
  }

  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get counselTechniqueId(): UniqueEntityId {
    return this.props.counselTechniqueId;
  }

  get promptVersionId(): UniqueEntityId {
    return this.props.promptVersionId;
  }

  get counselorUserRelationshipId(): UniqueEntityId {
    return this.props.counselorUserRelationshipId;
  }

  get lastChatedAt(): Dayjs | null {
    return this.props.lastChatedAt;
  }

  get lastMessage(): string | null {
    return this.props.lastMessage;
  }

  get messageCount(): number {
    return this.props.messageCount;
  }

  get notCompressedMessageCount(): number {
    return this.props.notCompressedMessageCount;
  }

  get lastContextCompressedAt(): Dayjs | null {
    return this.props.lastContextCompressedAt;
  }

  get compressedContextExists(): boolean {
    return this.props.compressedContextExists;
  }

  get counselContexts(): CounselContexts {
    return this.props.counselContexts;
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
  public saveLastMessage(lastMessage: string): Result<void> {
    this.props.lastMessage = lastMessage;
    this.props.lastChatedAt = getNowDayjs();
    return Result.ok();
  }

  public updateCounselTechniqueId(counselTechniqueId: UniqueEntityId): Result<void> {
    this.props.counselTechniqueId = counselTechniqueId;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public shouldCompressContext(): boolean {
    return this.props.notCompressedMessageCount >= Counsels.COMPRESSION_THRESHOLD;
  }

  public markContextCompressed(): void {
    const now = getNowDayjs();
    this.props.notCompressedMessageCount = 0;
    this.props.lastContextCompressedAt = now;
    this.props.compressedContextExists = true;
    this.props.updatedAt = now;
  }

  public increaseMessageCount(): void {
    this.props.messageCount++;
    this.props.notCompressedMessageCount++;
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
