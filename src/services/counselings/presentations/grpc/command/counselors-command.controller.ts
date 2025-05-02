import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  CreateCounselorRequest,
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  CreateToneRequest,
  CreateToneResponse,
  CreateToneResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
  UpdateToneRequest,
  UpdateToneResponse,
  UpdateToneResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counselor")
export class GrpcCounselorCommandController {
  constructor(private readonly counselorsFacade: CounselorsFacade, private readonly tonesFacade: TonesFacade) {}

  // Counselor
  @GrpcMethod("CounselorService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const { toneId, name, description, counselorGender } = request;
    const counselor = await this.counselorsFacade.createCounselor({
      toneId: new UniqueEntityId(toneId),
      name,
      description,
      counselorGender,
    });
    return create(CreateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselorService", "UpdateCounselor")
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
    const { counselorId, toneId, name, description, counselorGender } = request;
    const counselor = await this.counselorsFacade.updateCounselor({
      counselorId: new UniqueEntityId(counselorId),
      toneId: toneId ? new UniqueEntityId(toneId) : undefined,
      name,
      description,
      counselorGender,
    });
    return create(UpdateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }

  // Tone
  @GrpcMethod("CounselorService", "CreateTone")
  async createTone(request: CreateToneRequest): Promise<CreateToneResponse> {
    const { name, description } = request;
    const tone = await this.tonesFacade.createTone({
      name,
      description,
    });
    return create(CreateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselorService", "UpdateTone")
  async updateTone(request: UpdateToneRequest): Promise<UpdateToneResponse> {
    const { toneId, name, description } = request;
    const tone = await this.tonesFacade.updateTone({
      toneId: new UniqueEntityId(toneId),
      name,
      description,
    });
    return create(UpdateToneResponseSchema, {
      tone: SchemaCounselorsMapper.toToneProto(tone),
    });
  }
}
