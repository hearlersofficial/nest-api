import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesFacade } from "~counselings/applications/counselMessages.facade";
import { CounselsFacade } from "~counselings/applications/counsels.facade";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/counsels.mapper";
import {
  CreateCounselRequest,
  CreateCounselResponse,
  CreateCounselResponseSchema,
  CreateMessageRequest,
  CreateMessageResponse,
  CreateMessageResponseSchema,
  ReactMessageRequest,
  ReactMessageResponse,
  ReactMessageResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
@Controller("counsel")
export class GrpcCounselCommandController {
  constructor(private readonly counselsFacade: CounselsFacade, private readonly counselMessagesFacade: CounselMessagesFacade) {}

  @GrpcMethod("CounselService", "CreateCounsel")
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
      counselMessages: counselMessages.map(SchemaCounselsMapper.toCounselMessageProto),
    });
  }

  @GrpcMethod("CounselService", "CreateMessage")
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
