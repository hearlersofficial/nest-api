import { ReactMessageCommand } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.command";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CreateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.command";
import { UpdateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.command";
import { CreatePromptCommand } from "~counselings/aggregates/counselPrompts/applications/commands/CreatePrompt/CreatePrompt.command";
import { UpdatePromptCommand } from "~counselings/aggregates/counselPrompts/applications/commands/UpdatePrompt/UpdatePrompt.command";
import {
  CreateCounselCommand,
  CreateCounselCommandResult,
} from "~counselings/applications/commands/CreateCounsel/CreateCounsel.command";
import { CreateMessageCommand } from "~counselings/applications/commands/CreateMessage/CreateMessage.command";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
  CreateCounselorRequest,
  CreateCounselorResult,
  CreateCounselorResultSchema,
  CreateCounselRequest,
  CreateCounselResult,
  CreateCounselResultSchema,
  CreateMessageRequest,
  CreateMessageResult,
  CreateMessageResultSchema,
  CreatePromptRequest,
  CreatePromptResult,
  CreatePromptResultSchema,
  ReactMessageRequest,
  ReactMessageResult,
  ReactMessageResultSchema,
  UpdateCounselorRequest,
  UpdateCounselorResult,
  UpdateCounselorResultSchema,
  UpdatePromptRequest,
  UpdatePromptResult,
  UpdatePromptResultSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel")
export class GrpcCounselCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod("CounselService", "CreateCounsel")
  async createCounsel(request: CreateCounselRequest): Promise<CreateCounselResult> {
    const command: CreateCounselCommand = new CreateCounselCommand({
      userId: request.userId,
      counselorId: request.counselorId,
      introMessage: request.introMessage,
      responseMessage: request.responseMessage,
    });
    const { counsel, counselMessages }: CreateCounselCommandResult = await this.commandBus.execute(command);

    return create(CreateCounselResultSchema, {
      counsel: SchemaCounselsMapper.toCounselProto(counsel),
      counselMessages: counselMessages.map((counselMessage) =>
        SchemaCounselsMapper.toCounselMessageProto(counselMessage),
      ),
    });
  }

  @GrpcMethod("CounselService", "CreateMessage")
  async createCounselMessage(request: CreateMessageRequest): Promise<CreateMessageResult> {
    const command: CreateMessageCommand = new CreateMessageCommand({
      counselId: request.counselId,
      message: request.message,
    });
    const counselMessage: CounselMessages = await this.commandBus.execute(command);

    return create(CreateMessageResultSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }

  @GrpcMethod("CounselService", "ReactMessage")
  async reactCounselMessage(request: ReactMessageRequest): Promise<ReactMessageResult> {
    const command: ReactMessageCommand = new ReactMessageCommand({
      messageId: request.messageId,
      reaction: request.reaction,
    });
    const counselMessage: CounselMessages = await this.commandBus.execute(command);

    return create(ReactMessageResultSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }

  @GrpcMethod("CounselService", "CreatePrompt")
  async createCounselPrompt(request: CreatePromptRequest): Promise<CreatePromptResult> {
    const command: CreatePromptCommand = new CreatePromptCommand(request);
    const counselPrompt = await this.commandBus.execute(command);

    return create(CreatePromptResultSchema, {
      prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
    });
  }

  @GrpcMethod("CounselService", "UpdatePrompt")
  async updateCounselPrompt(request: UpdatePromptRequest): Promise<UpdatePromptResult> {
    const command: UpdatePromptCommand = new UpdatePromptCommand(request);
    const counselPrompt = await this.commandBus.execute(command);

    return create(UpdatePromptResultSchema, {
      prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
    });
  }

  @GrpcMethod("CounselService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResult> {
    const command: CreateCounselorCommand = new CreateCounselorCommand({
      counselorType: request.counselorType,
      name: request.name,
      description: request.description,
      gender: request.counselorGender,
    });
    const counselor = await this.commandBus.execute(command);

    return create(CreateCounselorResultSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselService", "UpdateCounselor")
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResult> {
    const command: UpdateCounselorCommand = new UpdateCounselorCommand({
      counselorId: request.counselorId,
      counselorType: request.counselorType,
      name: request.name,
      description: request.description,
      gender: request.counselorGender,
    });
    const counselor = await this.commandBus.execute(command);

    return create(UpdateCounselorResultSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }
}
