import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { SchemaCounselorsMapper } from "~counselings/presentations/grpc/counselors.mapper";
import {
  FindCounselorByIdRequest,
  FindCounselorByIdResponse,
  FindCounselorByIdResponseSchema,
  FindCounselorsRequest,
  FindCounselorsResponse,
  FindCounselorsResponseSchema,
} from "~proto/com/hearlers/v1/service/counselor_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counselors")
export class GrpcCounselorQueryController {
  constructor(private readonly counselorsFacade: CounselorsFacade) {}

  @GrpcMethod("CounselorService", "FindCounselors")
  async findCounselors(data: FindCounselorsRequest): Promise<FindCounselorsResponse> {
    const { toneId } = data;
    const counselors = await this.counselorsFacade.findCounselors({ toneId: new UniqueEntityId(toneId) });
    return create(FindCounselorsResponseSchema, {
      counselors: counselors.map((counselor) => SchemaCounselorsMapper.toCounselorProto(counselor)),
    });
  }

  @GrpcMethod("CounselorService", "FindCounselorById")
  async findCounselorById(data: FindCounselorByIdRequest): Promise<FindCounselorByIdResponse> {
    const { counselorId } = data;
    const counselor = await this.counselorsFacade.findCounselorById({ counselorId: new UniqueEntityId(counselorId) });
    return create(FindCounselorByIdResponseSchema, {
      counselor: SchemaCounselorsMapper.toCounselorProto(counselor),
    });
  }
}
