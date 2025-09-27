import { CounselManagementsFacade } from "~counselings/applications/counsel-managements/counsel-managements.facade";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/counsels.mapper";
import {
  FindCounselByIdRequest,
  FindCounselByIdRequestSchema,
  FindCounselByIdResponse,
  FindCounselByIdResponseSchema,
  FindCounselorUserRelationshipByIdRequest,
  FindCounselorUserRelationshipByIdRequestSchema,
  FindCounselorUserRelationshipByIdResponse,
  FindCounselorUserRelationshipByIdResponseSchema,
  FindCounselorUserRelationshipByUserAndCounselorIdRequest,
  FindCounselorUserRelationshipByUserAndCounselorIdRequestSchema,
  FindCounselorUserRelationshipByUserAndCounselorIdResponse,
  FindCounselorUserRelationshipByUserAndCounselorIdResponseSchema,
  FindCounselorUserRelationshipsRequest,
  FindCounselorUserRelationshipsRequestSchema,
  FindCounselorUserRelationshipsResponse,
  FindCounselorUserRelationshipsResponseSchema,
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
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
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

  @GrpcMethod("CounselService", "FindCounselorUserRelationshipById")
  @ProtoRequest(FindCounselorUserRelationshipByIdRequestSchema)
  async findCounselorUserRelationshipById(
    request: FindCounselorUserRelationshipByIdRequest,
  ): Promise<FindCounselorUserRelationshipByIdResponse> {
    const { relationshipId } = request;
    const relationship = await this.counselManagementsFacade.findCounselorUserRelationshipById({
      relationshipId: new CounselorUserRelationshipId(relationshipId),
    });
    return create(FindCounselorUserRelationshipByIdResponseSchema, {
      counselorUserRelationship: SchemaCounselsMapper.toCounselorUserRelationshipProto(relationship),
    });
  }

  @GrpcMethod("CounselService", "FindCounselorUserRelationshipByUserAndCounselorId")
  @ProtoRequest(FindCounselorUserRelationshipByUserAndCounselorIdRequestSchema)
  async findCounselorUserRelationshipByUserAndCounselorId(
    request: FindCounselorUserRelationshipByUserAndCounselorIdRequest,
  ): Promise<FindCounselorUserRelationshipByUserAndCounselorIdResponse> {
    const { userId, counselorId } = request;
    const relationship = await this.counselManagementsFacade.findCounselorUserRelationshipByUserAndCounselorId({
      userId: new UserId(userId),
      counselorId: new CounselorId(counselorId),
    });
    return create(FindCounselorUserRelationshipByUserAndCounselorIdResponseSchema, {
      counselorUserRelationship: SchemaCounselsMapper.toCounselorUserRelationshipProto(relationship),
    });
  }

  @GrpcMethod("CounselService", "FindCounselorUserRelationships")
  @ProtoRequest(FindCounselorUserRelationshipsRequestSchema)
  async findCounselorUserRelationships(
    request: FindCounselorUserRelationshipsRequest,
  ): Promise<FindCounselorUserRelationshipsResponse> {
    const { userId } = request;
    const relationships = await this.counselManagementsFacade.findCounselorUserRelationships({
      userId: new UserId(userId),
    });
    return create(FindCounselorUserRelationshipsResponseSchema, {
      counselorUserRelationships: relationships.map((relationship) =>
        SchemaCounselsMapper.toCounselorUserRelationshipProto(relationship),
      ),
    });
  }
}
