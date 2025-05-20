import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { CounselMessageCreatedEvent } from "~counselings/domains/counselMessages/events/counselMessage-created.event";
import { CounselMessageCreatedPayloadSchema } from "~proto/com/hearlers/v1/message/counsel_pb";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Dayjs } from "dayjs";
import { ChatCompletionAssistantMessageParam, ChatCompletionUserMessageParam } from "openai/resources";

export interface CounselMessagesNewProps {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  message: string;
  isUserMessage: boolean;
}

export interface CounselMessagesProps extends CounselMessagesNewProps {
  reactedAt: Dayjs | null;
  reaction: CounselMessageReaction | null;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselMessages extends AggregateRoot<CounselMessagesProps> {
  private constructor(props: CounselMessagesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselMessagesProps, id: UniqueEntityId): Result<CounselMessages> {
    const counselMessages = new CounselMessages(props, id);
    const validateResult = counselMessages.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselMessages>(validateResult.error as string);
    }
    return Result.ok<CounselMessages>(counselMessages);
  }

  public static createNew(newProps: CounselMessagesNewProps): Result<CounselMessages> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdMessage = this.create(
      {
        ...newProps,
        reactedAt: null,
        reaction: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    const counselMessageCreated = create(CounselMessageCreatedPayloadSchema, {
      counselMessageId: newId.getString(),
      counselId: newProps.counselId.getString(),
      userId: newProps.userId.getString(),
      message: newProps.message,
      isUserMessage: newProps.isUserMessage,
      occurredAt: getNowDayjs().toISOString(),
    });
    createdMessage.value.addDomainEvent(new CounselMessageCreatedEvent(counselMessageCreated));

    return createdMessage;
  }

  validateDomain(): Result<void> {
    // counselId 검증
    if (this.props.counselId === null || this.props.counselId === undefined) {
      return Result.fail("[CounselMessages] 상담 ID는 필수입니다");
    }

    // userId 검증
    if (this.props.userId === null || this.props.userId === undefined) {
      return Result.fail("[CounselMessages] 사용자 ID는 필수입니다");
    }

    // counselTechniqueId 검증
    if (this.props.counselTechniqueId === null || this.props.counselTechniqueId === undefined) {
      return Result.fail("[CounselMessages] 상담 기법 ID는 필수입니다");
    }

    // message 검증
    if (this.props.message === null || this.props.message === undefined) {
      return Result.fail("[CounselMessages] 메시지 내용은 필수입니다");
    }
    // gpt 응답은 80자 초과 가능
    if (this.props.isUserMessage && this.props.message.length > 80) {
      return Result.fail("[CounselMessages] 메시지 내용은 80자를 초과할 수 없습니다");
    }

    // isUserMessage 검증
    if (this.props.isUserMessage === null || this.props.isUserMessage === undefined) {
      return Result.fail("[CounselMessages] 사용자 메시지 여부는 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail("[CounselMessages] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail("[CounselMessages] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get counselId(): UniqueEntityId {
    return this.props.counselId;
  }

  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get counselTechniqueId(): UniqueEntityId {
    return this.props.counselTechniqueId;
  }

  get message(): string {
    return this.props.message;
  }

  get isUserMessage(): boolean {
    return this.props.isUserMessage;
  }

  get reactedAt(): Dayjs | null {
    return this.props.reactedAt;
  }

  get reaction(): CounselMessageReaction | null {
    return this.props.reaction;
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

  public makePrompt(): ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam {
    return {
      role: this.props.isUserMessage ? "user" : "assistant",
      content: this.props.message,
    };
  }

  public react(reaction: CounselMessageReaction): Result<void> {
    if (this.props.isUserMessage) {
      return Result.fail("[CounselMessages] 사용자 메시지에는 반응할 수 없습니다");
    }
    if (this.props.reactedAt) {
      return Result.fail("[CounselMessages] 이미 좋아요 또는 싫어요를 누른 메시지입니다");
    }
    this.props.reactedAt = getNowDayjs();
    this.props.reaction = reaction;

    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }
}
