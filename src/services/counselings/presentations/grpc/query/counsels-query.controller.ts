import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/counsels.mapper";
import {
  FindCounselByIdRequest,
  FindCounselByIdRequestSchema,
  FindCounselByIdResponse,
  FindCounselByIdResponseSchema,
  FindCounselsRequest,
  FindCounselsRequestSchema,
  FindCounselsResponse,
  FindCounselsResponseSchema,
  FindMessagesRequest,
  FindMessagesRequestSchema,
  FindMessagesResponse,
  FindMessagesResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly counselManagementsFacade: CounselManagementsFacade) {}

  @GrpcMethod("CounselService", "FindCounsels")
  @ProtoRequest(FindCounselsRequestSchema)
  async findCounsels(request: FindCounselsRequest): Promise<FindCounselsResponse> {
    const { userId, counselorId } = request;
    const counsels = await this.counselManagementsFacade.findCounsels({
      userId: new UserId(userId),
      counselorId: counselorId ? new CounselorId(counselorId) : undefined,
    });
    return create(FindCounselsResponseSchema, {
      counsels: counsels.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
    });
  }

  @GrpcMethod("CounselService", "FindCounselById")
  @ProtoRequest(FindCounselByIdRequestSchema)
  async findCounselById(request: FindCounselByIdRequest): Promise<FindCounselByIdResponse> {
    const { counselId } = request;
    const counsel = await this.counselManagementsFacade.findCounselById({
      counselId: new CounselId(counselId),
    });
    return create(FindCounselByIdResponseSchema, {
      counsel: SchemaCounselsMapper.toCounselProto(counsel),
    });
  }

  @GrpcMethod("CounselService", "FindMessages")
  @ProtoRequest(FindMessagesRequestSchema)
  async findMessages(request: FindMessagesRequest): Promise<FindMessagesResponse> {
    const { counselId } = request;
    const counselMessages = await this.counselManagementsFacade.findMessages({
      counselId: new CounselId(counselId),
    });
    return create(FindMessagesResponseSchema, {
      counselMessages: counselMessages.map((message) => SchemaCounselsMapper.toCounselMessageProto(message)),
    });
  }
}
