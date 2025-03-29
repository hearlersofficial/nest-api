import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesFacade } from "~counselings/applications/counselMessages.facade";
import { CounselsFacade } from "~counselings/applications/counsels.facade";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/counsels.mapper";
import {
  FindCounselByIdRequest,
  FindCounselByIdResponse,
  FindCounselByIdResponseSchema,
  FindCounselsRequest,
  FindCounselsResponse,
  FindCounselsResponseSchema,
  FindMessagesRequest,
  FindMessagesResponse,
  FindMessagesResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly counselsFacade: CounselsFacade, private readonly counselMessagesFacade: CounselMessagesFacade) {}

  @GrpcMethod("CounselService", "FindCounsels")
  async findCounsels(data: FindCounselsRequest): Promise<FindCounselsResponse> {
    const { userId, counselorId } = data;
    const counsels = await this.counselsFacade.findCounsels({
      userId: new UniqueEntityId(userId),
      counselorId: counselorId ? new UniqueEntityId(counselorId) : undefined,
    });
    return create(FindCounselsResponseSchema, {
      counsels: counsels.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
    });
  }

  @GrpcMethod("CounselService", "FindCounselById")
  async findCounselById(data: FindCounselByIdRequest): Promise<FindCounselByIdResponse> {
    const { counselId } = data;
    const counsel = await this.counselsFacade.findCounselById({ counselId: new UniqueEntityId(counselId) });
    return create(FindCounselByIdResponseSchema, { counsel: SchemaCounselsMapper.toCounselProto(counsel) });
  }

  @GrpcMethod("CounselService", "FindMessages")
  async findMessages(data: FindMessagesRequest): Promise<FindMessagesResponse> {
    const { counselId } = data;
    const counselMessages = await this.counselMessagesFacade.findMessages({ counselId: new UniqueEntityId(counselId) });
    return create(FindMessagesResponseSchema, {
      counselMessages: counselMessages.map((message) => SchemaCounselsMapper.toCounselMessageProto(message)),
    });
  }
}
