import { CounselMessagesFacade } from "~counselings/applications/counselMessages.facade";
import { CounselsFacade } from "~counselings/applications/counsels.facade";
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
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
@Controller("counsel")
export class GrpcCounselCommandController {
  constructor(
    private readonly counselsFacade: CounselsFacade,
    private readonly counselMessagesFacade: CounselMessagesFacade,
  ) {}

  @GrpcMethod("CounselService", "CreateCounsel")
  @ProtoRequest(CreateCounselRequestSchema)
  async createCounsel(request: CreateCounselRequest): Promise<CreateCounselResponse> {
    const { userId, counselorId, introMessage, responseMessage } = request;
    const { counsel, counselMessages } = await this.counselsFacade.createCounsel({
      userId: new UniqueEntityId(userId),
      counselorId: new UniqueEntityId(counselorId),
      introMessage,
      responseMessage,
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
    const { createdCounselMessage, counselorResponseMessage } = await this.counselMessagesFacade.createMessage({
      counselId: new UniqueEntityId(counselId),
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
    const counselMessage = await this.counselMessagesFacade.reactMessage({
      counselMessageId: new UniqueEntityId(messageId),
      reaction,
    });

    return create(ReactMessageResponseSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }
}
