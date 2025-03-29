import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  CreateCounselorRequest,
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counselor")
export class GrpcCounselorCommandController {
  constructor(private readonly counselorsFacade: CounselorsFacade) {}

  @GrpcMethod("CounselorService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const { toneId, name, description, counselorGender, persona } = request;
    const counselor = await this.counselorsFacade.createCounselor({
      toneId: new UniqueEntityId(toneId),
      name,
      description,
      counselorGender,
      persona,
    });
    return create(CreateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselorService", "UpdateCounselor")
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
    const { counselorId, toneId, name, description, counselorGender, persona } = request;
    const counselor = await this.counselorsFacade.updateCounselor({
      counselorId: new UniqueEntityId(counselorId),
      toneId: toneId ? new UniqueEntityId(toneId) : undefined,
      name,
      description,
      counselorGender,
      persona,
    });
    return create(UpdateCounselorResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }
}
