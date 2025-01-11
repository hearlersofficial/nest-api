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
  GetCounselListResult,
  GetCounselListResultSchema,
  GetCounselorListRequest,
  GetCounselorListResult,
  GetCounselorListResultSchema,
  GetMessageListRequest,
  GetMessageListResult,
  GetMessageListResultSchema,
  GetPromptListRequest,
  GetPromptListResult,
  GetPromptListResultSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @GrpcMethod("CounselService", "GetCounselList")
  async getCounselList(data: GetCounselListRequest): Promise<GetCounselListResult> {
    const query: GetCounselListQuery = new GetCounselListQuery({ userId: data.userId });
    const counselList: Counsels[] = await this.queryBus.execute(query);

    return create(GetCounselListResultSchema, {
      counselList: counselList.map((counsel) => SchemaCounselsMapper.toCounselProto(counsel)),
    });
  }

  @GrpcMethod("CounselService", "GetMessageList")
  async getMessageList(data: GetMessageListRequest): Promise<GetMessageListResult> {
    const query: GetMessageListQuery = new GetMessageListQuery({ counselId: data.counselId });
    const counselMessageList: CounselMessages[] = await this.queryBus.execute(query);

    return create(GetMessageListResultSchema, {
      messageList: counselMessageList.map((counselMessage) =>
        SchemaCounselsMapper.toCounselMessageProto(counselMessage),
      ),
    });
  }

  @GrpcMethod("CounselService", "GetPromptList")
  async getPromptList(data: GetPromptListRequest): Promise<GetPromptListResult> {
    const query: GetPromptListQuery = new GetPromptListQuery({ promptType: data.promptType });
    const counselPromptList: CounselPrompts[] = await this.queryBus.execute(query);

    return create(GetPromptListResultSchema, {
      promptList: counselPromptList.map((counselPrompt) => SchemaCounselsMapper.toCounselPromptProto(counselPrompt)),
    });
  }

  @GrpcMethod("CounselService", "GetCounselorList")
  async getCounselorList(data: GetCounselorListRequest): Promise<GetCounselorListResult> {
    const query: GetCounselorListQuery = new GetCounselorListQuery({ counselorType: data.counselorType });
    const counselorList: Counselors[] = await this.queryBus.execute(query);

    return create(GetCounselorListResultSchema, {
      counselorList: counselorList.map((counselor) => SchemaCounselsMapper.toCounselorProto(counselor)),
    });
  }
}
