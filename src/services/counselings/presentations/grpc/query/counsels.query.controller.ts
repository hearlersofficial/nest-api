import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { FindPersonaByIdQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonaById/FindPersonaById.query";
import { FindPersonasQuery } from "~counselings/aggregates/personas/applications/queries/FindPersonas/FindPersonas.query";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { FindToneByIdQuery } from "~counselings/aggregates/tones/applications/queries/FindToneById/FindToneById.query";
import { FindTonesQuery } from "~counselings/aggregates/tones/applications/queries/FindTones/FineTones.query";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
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

  // @GrpcMethod("CounselService", "GetCounselList")
  // async getCounselList(data: GetCounselListRequest): Promise<GetCounselListResponse> {
  //   const query: GetCounselListQuery = new GetCounselListQuery({ userId: new UniqueEntityId(data.userId) });
  //   const counselList: Counsels[] = await this.queryBus.execute(query);

  //   return create(GetCounselListResponseSchema, {
  //     counselList: counselList.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
  //   });
  // }

  // @GrpcMethod("CounselService", "GetMessageList")
  // async getMessageList(data: GetMessageListRequest): Promise<GetMessageListResponse> {
  //   const query: GetMessageListQuery = new GetMessageListQuery({ counselId: new UniqueEntityId(data.counselId) });
  //   const counselMessageList: CounselMessages[] = await this.queryBus.execute(query);

  //   return create(GetMessageListResponseSchema, {
  //     messageList: counselMessageList.map((counselMessage) =>
  //       SchemaCounselsMapper.toCounselMessageProto(counselMessage),
  //     ),
  //   });
  // }

  // @GrpcMethod("CounselService", "GetPromptList")
  // async getPromptList(data: GetPromptListRequest): Promise<GetPromptListResponse> {
  //   const query: GetPromptListQuery = new GetPromptListQuery({ promptType: data.promptType });
  //   const counselPromptList: CounselPrompts[] = await this.queryBus.execute(query);

  //   return create(GetPromptListResponseSchema, {
  //     promptList: counselPromptList.map((counselPrompt) => SchemaCounselsMapper.toCounselPromptProto(counselPrompt)),
  //   });
  // }

  // @GrpcMethod("CounselService", "GetCounselorList")
  // async getCounselorList(data: GetCounselorListRequest): Promise<GetCounselorListResponse> {
  //   const query: GetCounselorListQuery = new GetCounselorListQuery({ counselorType: data.counselorType });
  //   const counselorList: Counselors[] = await this.queryBus.execute(query);

  //   return create(GetCounselorListResponseSchema, {
  //     counselorList: counselorList.map((counselor) => SchemaCounselsMapper.toCounselorProto(counselor)),
  //   });
  // }
}
