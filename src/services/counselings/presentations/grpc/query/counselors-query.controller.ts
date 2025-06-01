import { CounselorManagementsFacade } from "~counselings/applications/counselor-managements/counselor-managements.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  FindBubbleByIdRequest,
  FindBubbleByIdRequestSchema,
  FindBubbleByIdResponse,
  FindBubbleByIdResponseSchema,
  FindBubblesRequest,
  FindBubblesRequestSchema,
  FindBubblesResponse,
  FindBubblesResponseSchema,
  FindCounselorByIdRequest,
  FindCounselorByIdRequestSchema,
  FindCounselorByIdResponse,
  FindCounselorByIdResponseSchema,
  FindCounselorsRequest,
  FindCounselorsRequestSchema,
  FindCounselorsResponse,
  FindCounselorsResponseSchema,
  FindRandomBubbleRequest,
  FindRandomBubbleRequestSchema,
  FindRandomBubbleResponse,
  FindRandomBubbleResponseSchema,
  FindToneByIdRequest,
  FindToneByIdRequestSchema,
  FindToneByIdResponse,
  FindToneByIdResponseSchema,
  FindTonesRequest,
  FindTonesRequestSchema,
  FindTonesResponse,
  FindTonesResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Controller("counselors")
export class GrpcCounselorQueryController {
  constructor(private readonly counselorManagementsFacade: CounselorManagementsFacade) {}

  // Counselor
  @GrpcMethod("CounselorService", "FindCounselors")
  @ProtoRequest(FindCounselorsRequestSchema)
  async findCounselors(request: FindCounselorsRequest): Promise<FindCounselorsResponse> {
    const { toneId } = request;
    const counselors = await this.counselorManagementsFacade.findCounselors({
      toneId: toneId ? new UniqueEntityId(toneId) : undefined,
    });
    return create(FindCounselorsResponseSchema, {
      counselors: counselors.map((counselor) => SchemaCounselorsMapper.toCounselorProto(counselor)),
    });
  }

  @GrpcMethod("CounselorService", "FindCounselorById")
  @ProtoRequest(FindCounselorByIdRequestSchema)
  async findCounselorById(request: FindCounselorByIdRequest): Promise<FindCounselorByIdResponse> {
    const { counselorId } = request;
    const counselor = await this.counselorManagementsFacade.findCounselorById({
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(FindCounselorByIdResponseSchema, {
      counselor: counselor ? SchemaCounselorsMapper.toCounselorProto(counselor) : undefined,
    });
  }

  // Tone
  @GrpcMethod("CounselorService", "FindTones")
  @ProtoRequest(FindTonesRequestSchema)
  async findTones(request: FindTonesRequest): Promise<FindTonesResponse> {
    const { name } = request;
    const tones = await this.counselorManagementsFacade.findTones({ name });
    return create(FindTonesResponseSchema, {
      tones: tones.map((tone) => SchemaCounselorsMapper.toToneProto(tone)),
    });
  }

  @GrpcMethod("CounselorService", "FindToneById")
  @ProtoRequest(FindToneByIdRequestSchema)
  async findToneById(request: FindToneByIdRequest): Promise<FindToneByIdResponse> {
    const { toneId } = request;
    const tone = await this.counselorManagementsFacade.findToneById({
      toneId: new UniqueEntityId(toneId),
    });
    return create(FindToneByIdResponseSchema, {
      tone: tone ? SchemaCounselorsMapper.toToneProto(tone) : undefined,
    });
  }

  @GrpcMethod("CounselorService", "FindBubbles")
  @ProtoRequest(FindBubblesRequestSchema)
  async findBubbles(request: FindBubblesRequest): Promise<FindBubblesResponse> {
    const { counselorId } = request;
    const bubbles = await this.counselorManagementsFacade.findBubbles({
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(FindBubblesResponseSchema, {
      bubbles: bubbles.map((bubble) => SchemaCounselorsMapper.toBubbleProto(bubble)),
    });
  }

  @GrpcMethod("CounselorService", "FindBubbleById")
  @ProtoRequest(FindBubbleByIdRequestSchema)
  async findBubbleById(request: FindBubbleByIdRequest): Promise<FindBubbleByIdResponse> {
    const { bubbleId } = request;
    const bubble = await this.counselorManagementsFacade.findBubbleById({
      bubbleId: new UniqueEntityId(bubbleId),
    });
    return create(FindBubbleByIdResponseSchema, {
      bubble: bubble ? SchemaCounselorsMapper.toBubbleProto(bubble) : undefined,
    });
  }

  @GrpcMethod("CounselorService", "FindRandomBubble")
  @ProtoRequest(FindRandomBubbleRequestSchema)
  async findRandomBubble(request: FindRandomBubbleRequest): Promise<FindRandomBubbleResponse> {
    const { counselorId } = request;
    const bubble = await this.counselorManagementsFacade.findRandomBubble({
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(FindRandomBubbleResponseSchema, {
      bubble: bubble ? SchemaCounselorsMapper.toBubbleProto(bubble) : undefined,
    });
  }
}
