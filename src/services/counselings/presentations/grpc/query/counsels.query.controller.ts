import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { FindContextByIdQuery } from "~counselings/aggregates/contexts/applications/queries/FindContextById/FindContextById.query";
import { FindContextsQuery } from "~counselings/aggregates/contexts/applications/queries/FindContexts/FindContexts.query";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { FindMessagesQuery } from "~counselings/aggregates/counselMessages/applications/queries/FindMessages/FindMessages.query";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { FindCounselorByIdQuery } from "~counselings/aggregates/counselors/applications/queries/FindCounselorById/FindCounselorById.query";
import { FindCounselorsQuery } from "~counselings/aggregates/counselors/applications/queries/FindCounselors/FindCounselors.query";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { FindCounselByIdQuery } from "~counselings/aggregates/counsels/applications/queries/FindCounselById/FindCounselById.query";
import { FindCounselsQuery } from "~counselings/aggregates/counsels/applications/queries/FindCounsels/FindCounsels.query";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { FindPersonaByIdQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonaById/FindPersonaById.query";
import { FindPersonasQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonas/FindPersonas.query";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { FindToneByIdQuery } from "~counselings/aggregates/tones/applications/queries/FindToneById/FindToneById.query";
import { FindTonesQuery } from "~counselings/aggregates/tones/applications/queries/FindTones/FineTones.query";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
  FindContextByIdRequest,
  FindContextByIdResponse,
  FindContextByIdResponseSchema,
  FindContextsRequest,
  FindContextsResponse,
  FindContextsResponseSchema,
  FindCounselByIdRequest,
  FindCounselByIdResponse,
  FindCounselByIdResponseSchema,
  FindCounselorByIdRequest,
  FindCounselorByIdResponse,
  FindCounselorByIdResponseSchema,
  FindCounselorsRequest,
  FindCounselorsResponse,
  FindCounselorsResponseSchema,
  FindCounselsRequest,
  FindCounselsResponse,
  FindCounselsResponseSchema,
  FindMessagesRequest,
  FindMessagesResponse,
  FindMessagesResponseSchema,
  FindPersonaByIdRequest,
  FindPersonaByIdResponse,
  FindPersonaByIdResponseSchema,
  FindPersonasRequest,
  FindPersonasResponse,
  FindPersonasResponseSchema,
  FindToneByIdRequest,
  FindToneByIdResponse,
  FindToneByIdResponseSchema,
  FindTonesRequest,
  FindTonesResponse,
  FindTonesResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod("CounselService", "FindCounsels")
  async findCounsels(data: FindCounselsRequest): Promise<FindCounselsResponse> {
    const query: FindCounselsQuery = new FindCounselsQuery({
      userId: new UniqueEntityId(data.userId),
      counselorId: data.counselorId ? new UniqueEntityId(data.counselorId) : undefined,
    });
    const counsels: Counsels[] = await this.queryBus.execute(query);
    return create(FindCounselsResponseSchema, {
      counsels: counsels.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
    });
  }

  @GrpcMethod("CounselService", "FindCounselById")
  async findCounselById(data: FindCounselByIdRequest): Promise<FindCounselByIdResponse> {
    const query: FindCounselByIdQuery = new FindCounselByIdQuery({
      counselId: new UniqueEntityId(data.counselId),
    });
    const counsel: Counsels = await this.queryBus.execute(query);
    return create(FindCounselByIdResponseSchema, { counsel: SchemaCounselsMapper.toCounselProto(counsel) });
  }

  @GrpcMethod("CounselService", "FindMessages")
  async findMessages(data: FindMessagesRequest): Promise<FindMessagesResponse> {
    const query: FindMessagesQuery = new FindMessagesQuery({
      counselId: new UniqueEntityId(data.counselId),
    });
    const counselMessages: CounselMessages[] = await this.queryBus.execute(query);
    return create(FindMessagesResponseSchema, {
      counselMessages: counselMessages.map((message) => SchemaCounselsMapper.toCounselMessageProto(message)),
    });
  }

  @GrpcMethod("CounselService", "FindCounselors")
  async findCounselors(data: FindCounselorsRequest): Promise<FindCounselorsResponse> {
    const query: FindCounselorsQuery = new FindCounselorsQuery({
      toneId: data.toneId ? new UniqueEntityId(data.toneId) : undefined,
    });
    const counselors: Counselors[] = await this.queryBus.execute(query);
    return create(FindCounselorsResponseSchema, {
      counselors: counselors.map((counselor) => SchemaCounselsMapper.toCounselorProto(counselor)),
    });
  }

  @GrpcMethod("CounselService", "FindCounselorById")
  async findCounselorById(data: FindCounselorByIdRequest): Promise<FindCounselorByIdResponse> {
    const query: FindCounselorByIdQuery = new FindCounselorByIdQuery({
      counselorId: new UniqueEntityId(data.counselorId),
    });
    const counselor: Counselors = await this.queryBus.execute(query);
    return create(FindCounselorByIdResponseSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselService", "FindPersonas")
  async findPersonas(data: FindPersonasRequest): Promise<FindPersonasResponse> {
    const query: FindPersonasQuery = new FindPersonasQuery({ counselorId: new UniqueEntityId(data.counselorId) });
    const personas: Personas[] = await this.queryBus.execute(query);
    return create(FindPersonasResponseSchema, {
      personas: personas?.map((persona) => SchemaCounselsMapper.toPersonaProto(persona)),
    });
  }

  @GrpcMethod("CounselService", "FindPersonaById")
  async findPersonaById(data: FindPersonaByIdRequest): Promise<FindPersonaByIdResponse> {
    const query: FindPersonaByIdQuery = new FindPersonaByIdQuery(new UniqueEntityId(data.personaId));
    const persona: Personas = await this.queryBus.execute(query);
    return create(FindPersonaByIdResponseSchema, { persona: SchemaCounselsMapper.toPersonaProto(persona) });
  }

  @GrpcMethod("CounselService", "FindContexts")
  async findContexts(data: FindContextsRequest): Promise<FindContextsResponse> {
    const query: FindContextsQuery = new FindContextsQuery({ name: data.name });
    const contexts: Contexts[] = await this.queryBus.execute(query);
    return create(FindContextsResponseSchema, {
      contexts: contexts?.map((context) => SchemaCounselsMapper.toContextProto(context)),
    });
  }

  @GrpcMethod("CounselService", "FindContextById")
  async findContextById(data: FindContextByIdRequest): Promise<FindContextByIdResponse> {
    const query: FindContextByIdQuery = new FindContextByIdQuery(new UniqueEntityId(data.contextId));
    const context: Contexts = await this.queryBus.execute(query);
    return create(FindContextByIdResponseSchema, { context: SchemaCounselsMapper.toContextProto(context) });
  }

  @GrpcMethod("CounselService", "FindTones")
  async findTones(data: FindTonesRequest): Promise<FindTonesResponse> {
    const query: FindTonesQuery = new FindTonesQuery({ name: data.name });
    const tones: Tones[] = await this.queryBus.execute(query);
    return create(FindTonesResponseSchema, {
      tones: tones?.map((tone) => SchemaCounselsMapper.toToneProto(tone)),
    });
  }

  @GrpcMethod("CounselService", "FindToneById")
  async findToneById(data: FindToneByIdRequest): Promise<FindToneByIdResponse> {
    const query: FindToneByIdQuery = new FindToneByIdQuery(new UniqueEntityId(data.toneId));
    const tone: Tones = await this.queryBus.execute(query);
    return create(FindToneByIdResponseSchema, { tone: SchemaCounselsMapper.toToneProto(tone) });
  }
}
