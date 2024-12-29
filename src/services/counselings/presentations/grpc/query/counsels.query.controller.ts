import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
import { GetCounselListQuery } from "~/src/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.query";
import { Counsels } from "~/src/aggregates/counsels/domain/Counsels";
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
} from "~/src/gen/com/hearlers/v1/service/counsel_pb";
import { SchemaCounselsMapper } from "../schema.counsels.mapper";
import { GetMessageListQuery } from "~/src/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query";
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { GetPromptListQuery } from "~/src/aggregates/counselPrompts/applications/queries/GetPromptList/GetPromptList.query";
import { CounselPrompts } from "~/src/aggregates/counselPrompts/domain/CounselPrompts";
import { GetCounselorListQuery } from "~/src/aggregates/counselors/applications/queries/GetCounselorList/GetCounselorList.query";
import { Counselors } from "~/src/aggregates/counselors/domain/counselors";

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
