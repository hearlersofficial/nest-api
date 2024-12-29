import { create } from "@bufbuild/protobuf";
import { Dayjs } from "dayjs";
import { ChatCompletionAssistantMessageParam, ChatCompletionUserMessageParam } from "openai/resources";
import { CounselMessageCreatedPayloadSchema } from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { AggregateRoot } from "~/src/shared/core/domain/AggregateRoot";
import { Result } from "~/src/shared/core/domain/Result";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { formatDayjs, getNowDayjs } from "~/src/shared/utils/Date.utils";
import { CounselMessageCreatedEvent } from "./events/CounselMessageCreatedEvents";

interface CounselMessagesNewProps {
  counselId: UniqueEntityId;
  message: string;
  isUserMessage: boolean;
}

interface CounselMessagesProps extends CounselMessagesNewProps {
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
      return Result.fail<CounselMessages>(validateResult.error);
    }
    return Result.ok<CounselMessages>(counselMessages);
  }

  public static createNew(newProps: CounselMessagesNewProps): Result<CounselMessages> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const createdMessage = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
    if (createdMessage.isSuccess) {
      const message = createdMessage.value;
      const counselMessageCreated = create(CounselMessageCreatedPayloadSchema, {
        counselId: message.counselId.getNumber(),
        message: message.message,
        isUserMessage: message.isUserMessage,
        occurredAt: formatDayjs(getNowDayjs()),
      });
      createdMessage.value.addDomainEvent(new CounselMessageCreatedEvent(counselMessageCreated));
    }

    return createdMessage;
  }

  validateDomain(): Result<void> {
    // counselId 검증
    if (this.props.counselId === null || this.props.counselId === undefined) {
      return Result.fail<void>("[CounselMessages] 상담 ID는 필수입니다");
    }

    // message 검증
    if (this.props.message === null || this.props.message === undefined) {
      return Result.fail<void>("[CounselMessages] 메시지 내용은 필수입니다");
    }
    // gpt 응답은 80자 초과 가능
    if (this.props.isUserMessage && this.props.message.length > 80) {
      return Result.fail<void>("[CounselMessages] 메시지 내용은 80자를 초과할 수 없습니다");
    }

    // isUserMessage 검증
    if (this.props.isUserMessage === null || this.props.isUserMessage === undefined) {
      return Result.fail<void>("[CounselMessages] 사용자 메시지 여부는 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[CounselMessages] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[CounselMessages] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get counselId(): UniqueEntityId {
    return this.props.counselId;
  }

  get message(): string {
    return this.props.message;
  }

  get isUserMessage(): boolean {
    return this.props.isUserMessage;
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

  public checkExtreme(): boolean {
    return this.props.message.includes("왜 사는지");
  }

  public checkNeedBranch(): boolean {
    const end_msg = "같이 더 이야기해보자.";
    return this.props.message.includes(end_msg);
  }
}
