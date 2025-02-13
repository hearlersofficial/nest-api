import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
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
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  CreateCounselRequest,
  CreateCounselResponse,
  CreateCounselResponseSchema,
  CreateMessageRequest,
  CreateMessageResponse,
  CreateMessageResponseSchema,
  CreatePromptRequest,
  CreatePromptResponse,
  CreatePromptResponseSchema,
  ReactMessageRequest,
  ReactMessageResponse,
  ReactMessageResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
  UpdatePromptRequest,
  UpdatePromptResponse,
  UpdatePromptResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { GrpcMethod } from "@nestjs/microservices";
@Controller("counsel")
export class GrpcCounselCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  @GrpcMethod("CounselService", "CreateCounsel")
  async createCounsel(request: CreateCounselRequest): Promise<CreateCounselResponse> {
    const command: CreateCounselCommand = new CreateCounselCommand({
      userId: new UniqueEntityId(request.userId),
      counselorId: new UniqueEntityId(request.counselorId),
      introMessage: request.introMessage,
      responseMessage: request.responseMessage,
    });
    const { counsel, counselMessages }: CreateCounselCommandResult = await this.commandBus.execute(command);

    return create(CreateCounselResponseSchema, {
      counsel: SchemaCounselsMapper.toCounselProto(counsel),
      counselMessages: counselMessages.map((counselMessage) =>
        SchemaCounselsMapper.toCounselMessageProto(counselMessage),
      ),
    });
  }

  @GrpcMethod("CounselService", "CreateMessage")
  async createCounselMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    const command: CreateMessageCommand = new CreateMessageCommand({
      counselId: new UniqueEntityId(request.counselId),
      message: request.message,
    });
    const counselMessage: CounselMessages = await this.commandBus.execute(command);

    return create(CreateMessageResponseSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }

  @GrpcMethod("CounselService", "ReactMessage")
  async reactCounselMessage(request: ReactMessageRequest): Promise<ReactMessageResponse> {
    const command: ReactMessageCommand = new ReactMessageCommand({
      messageId: new UniqueEntityId(request.messageId),
      reaction: request.reaction,
    });
    const counselMessage: CounselMessages = await this.commandBus.execute(command);

    return create(ReactMessageResponseSchema, {
      counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
    });
  }

  @GrpcMethod("CounselService", "CreatePrompt")
  async createCounselPrompt(request: CreatePromptRequest): Promise<CreatePromptResponse> {
    const command: CreatePromptCommand = new CreatePromptCommand(request);
    const counselPrompt = await this.commandBus.execute(command);

    return create(CreatePromptResponseSchema, {
      prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
    });
  }

  @GrpcMethod("CounselService", "UpdatePrompt")
  async updateCounselPrompt(request: UpdatePromptRequest): Promise<UpdatePromptResponse> {
    const command: UpdatePromptCommand = new UpdatePromptCommand({
      promptId: new UniqueEntityId(request.promptId),
      persona: request.persona,
      context: request.context,
      instruction: request.instruction,
      tone: request.tone,
      additionalPrompt: request.additionalPrompt,
      version: request.version,
    });
    const counselPrompt = await this.commandBus.execute(command);

    return create(UpdatePromptResponseSchema, {
      prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
    });
  }

  @GrpcMethod("CounselService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const command: CreateCounselorCommand = new CreateCounselorCommand({
      counselorType: request.counselorType,
      name: request.name,
      description: request.description,
      gender: request.counselorGender,
    });
    const counselor = await this.commandBus.execute(command);

    return create(CreateCounselorResponseSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselService", "UpdateCounselor")
  async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
    const command: UpdateCounselorCommand = new UpdateCounselorCommand({
      counselorId: new UniqueEntityId(request.counselorId),
      counselorType: request.counselorType,
      name: request.name,
      description: request.description,
      gender: request.counselorGender,
    });
    const counselor = await this.commandBus.execute(command);

    return create(UpdateCounselorResponseSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }
}
