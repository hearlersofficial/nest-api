import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/counsels.mapper";
import {
  CreateCounselRequest,
  CreateCounselRequestSchema,
  CreateCounselResponse,
  CreateCounselResponseSchema,
  CreateMessageRequest,
  CreateMessageRequestSchema,
  CreateMessageResponse,
  CreateMessageResponseSchema,
  ReactMessageRequest,
  ReactMessageRequestSchema,
  ReactMessageResponse,
  ReactMessageResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { BubbleId } from "~common/shared-kernel/identifiers/bubble.id";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
@Controller("counsel")
export class GrpcCounselCommandController {
  constructor(private readonly counselManagementsFacade: CounselManagementsFacade) {}

  @GrpcMethod("CounselService", "CreateCounsel")
  @ProtoRequest(CreateCounselRequestSchema)
  async createCounsel(request: CreateCounselRequest): Promise<CreateCounselResponse> {
    const { userId, counselorId, bubbleId, responseOptionNo, promptVersionId } = request;
    const { counsel, counselMessages } = await this.counselManagementsFacade.createCounsel({
      userId: new UserId(userId),
      counselorId: new CounselorId(counselorId),
      bubbleId: bubbleId ? new BubbleId(bubbleId) : undefined,
      responseOptionNumber: responseOptionNo,
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
    });
    return create(CreateCounselResponseSchema, {
      counsel: SchemaCounselsMapper.toCounselProto(counsel),
      counselMessages: (counselMessages ?? []).map((counselMessage) =>
        SchemaCounselsMapper.toCounselMessageProto(counselMessage),
      ),
    });
  }

  @GrpcMethod("CounselService", "CreateMessage")
  @ProtoRequest(CreateMessageRequestSchema)
  async createCounselMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    const { counselId, message } = request;
    const { createdCounselMessage, counselorResponseMessage } = await this.counselManagementsFacade.createMessage({
      counselId: new CounselId(counselId),
      message,
    });
    return create(CreateMessageResponseSchema, {
      createdCounselMessage: SchemaCounselsMapper.toCounselMessageProto(createdCounselMessage),
      counselorResponseMessage: SchemaCounselsMapper.toCounselMessageProto(counselorResponseMessage),
    });
  }

  @GrpcMethod("CounselService", "ReactMessage")
  @ProtoRequest(ReactMessageRequestSchema)
  async reactCounselMessage(request: ReactMessageRequest): Promise<ReactMessageResponse> {
    const { messageId, reaction } = request;
    const counselMessage = await this.counselManagementsFacade.reactMessage({
      messageId: new CounselMessageId(messageId),
      reaction,
    });

    return create(ReactMessageResponseSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }
}
