import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  FindCounselorByIdRequest,
  FindCounselorByIdResponse,
  FindCounselorByIdResponseSchema,
  FindCounselorsRequest,
  FindCounselorsResponse,
  FindCounselorsResponseSchema,
  FindToneByIdRequest,
  FindToneByIdResponse,
  FindToneByIdResponseSchema,
  FindTonesRequest,
  FindTonesResponse,
  FindTonesResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counselors")
export class GrpcCounselorQueryController {
  constructor(private readonly counselorsFacade: CounselorsFacade, private readonly tonesFacade: TonesFacade) {}

  // Counselor
  @GrpcMethod("CounselorService", "FindCounselors")
  async findCounselors(request: FindCounselorsRequest): Promise<FindCounselorsResponse> {
    const { toneId } = request;
    const counselors = await this.counselorsFacade.findCounselors({
      toneId: toneId ? new UniqueEntityId(toneId) : undefined,
    });
    return create(FindCounselorsResponseSchema, {
      counselors: counselors.map((counselor) => SchemaCounselorsMapper.toCounselorProto(counselor)),
    });
  }

  @GrpcMethod("CounselorService", "FindCounselorById")
  async findCounselorById(request: FindCounselorByIdRequest): Promise<FindCounselorByIdResponse> {
    const { counselorId } = request;
    const counselor = await this.counselorsFacade.findCounselorById({
      counselorId: new UniqueEntityId(counselorId),
    });
    return create(FindCounselorByIdResponseSchema, {
      counselor: counselor ? SchemaCounselorsMapper.toCounselorProto(counselor) : undefined,
    });
  }

  // Tone
  @GrpcMethod("CounselorService", "FindTones")
  async findTones(request: FindTonesRequest): Promise<FindTonesResponse> {
    const { name } = request;
    const tones = await this.tonesFacade.findTones({ name });
    return create(FindTonesResponseSchema, {
      tones: tones.map((tone) => SchemaCounselorsMapper.toToneProto(tone)),
    });
  }

  @GrpcMethod("CounselorService", "FindToneById")
  async findToneById(request: FindToneByIdRequest): Promise<FindToneByIdResponse> {
    const { toneId } = request;
    const tone = await this.tonesFacade.findToneById({
      toneId: new UniqueEntityId(toneId),
    });
    return create(FindToneByIdResponseSchema, {
      tone: tone ? SchemaCounselorsMapper.toToneProto(tone) : undefined,
    });
  }
}
