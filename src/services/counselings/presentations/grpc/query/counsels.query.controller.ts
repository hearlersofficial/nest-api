import { GetMessageListQuery } from "~counselings/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { GetCounselorListQuery } from "~counselings/aggregates/counselors/applications/queries/GetCounselorList/GetCounselorList.query";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { GetPromptListQuery } from "~counselings/aggregates/counselPrompts/applications/queries/GetPromptList/GetPromptList.query";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import { GetCounselListQuery } from "~counselings/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.query";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
  GetCounselListRequest,
  GetCounselListResponse,
  GetCounselListResponseSchema,
  GetCounselorListRequest,
  GetCounselorListResponse,
  GetCounselorListResponseSchema,
  GetMessageListRequest,
  GetMessageListResponse,
  GetMessageListResponseSchema,
  GetPromptListRequest,
<<<<<<< HEAD
  GetPromptListResult,
  GetPromptListResultSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
=======
  GetPromptListResponse,
  GetPromptListResponseSchema,
} from "~/src/gen/com/hearlers/v1/service/counsel_pb";
import { SchemaCounselsMapper } from "../schema.counsels.mapper";
import { GetMessageListQuery } from "~/src/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { GetPromptListQuery } from "~/src/aggregates/counselPrompts/applications/queries/GetPromptList/GetPromptList.query";
import { CounselPrompts } from "~/src/aggregates/counselPrompts/domain/CounselPrompts";
import { GetCounselorListQuery } from "~/src/aggregates/counselors/applications/queries/GetCounselorList/GetCounselorList.query";
import { Counselors } from "~/src/aggregates/counselors/domain/counselors";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod("CounselService", "GetCounselList")
  async getCounselList(data: GetCounselListRequest): Promise<GetCounselListResponse> {
    const query: GetCounselListQuery = new GetCounselListQuery({ userId: new UniqueEntityId(data.userId) });
    const counselList: Counsels[] = await this.queryBus.execute(query);

    return create(GetCounselListResponseSchema, {
      counselList: counselList.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
    });
  }

  @GrpcMethod("CounselService", "GetMessageList")
  async getMessageList(data: GetMessageListRequest): Promise<GetMessageListResponse> {
    const query: GetMessageListQuery = new GetMessageListQuery({ counselId: new UniqueEntityId(data.counselId) });
    const counselMessageList: CounselMessages[] = await this.queryBus.execute(query);

    return create(GetMessageListResponseSchema, {
      messageList: counselMessageList.map((counselMessage) =>
        SchemaCounselsMapper.toCounselMessageProto(counselMessage),
      ),
    });
  }

  @GrpcMethod("CounselService", "GetPromptList")
  async getPromptList(data: GetPromptListRequest): Promise<GetPromptListResponse> {
    const query: GetPromptListQuery = new GetPromptListQuery({ promptType: data.promptType });
    const counselPromptList: CounselPrompts[] = await this.queryBus.execute(query);

    return create(GetPromptListResponseSchema, {
      promptList: counselPromptList.map((counselPrompt) => SchemaCounselsMapper.toCounselPromptProto(counselPrompt)),
    });
  }

  @GrpcMethod("CounselService", "GetCounselorList")
  async getCounselorList(data: GetCounselorListRequest): Promise<GetCounselorListResponse> {
    const query: GetCounselorListQuery = new GetCounselorListQuery({ counselorType: data.counselorType });
    const counselorList: Counselors[] = await this.queryBus.execute(query);

    return create(GetCounselorListResponseSchema, {
      counselorList: counselorList.map((counselor) => SchemaCounselsMapper.toCounselorProto(counselor)),
    });
  }
}
