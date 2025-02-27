import { Controller } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

@Controller("counsel")
export class GrpcCounselQueryController {
  constructor(private readonly queryBus: QueryBus) {}

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
