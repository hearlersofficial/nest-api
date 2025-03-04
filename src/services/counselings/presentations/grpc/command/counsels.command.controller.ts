import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ReactMessageCommand } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.command";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CreatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/CreatePersona/CreatePersona.command";
import { UpdatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/UpdatePersona/UpdatePersona.command";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { CreateToneCommand } from "~counselings/aggregates/tones/applications/commands/CreateTone/CreateTone.command";
import { UpdateToneCommand } from "~counselings/aggregates/tones/applications/commands/UpdateTone/UpdateTone.command";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import {
  CreateCounselCommand,
  CreateCounselCommandResult,
} from "~counselings/applications/commands/CreateCounsel/CreateCounsel.command";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
  CreateCounselRequest,
  CreateCounselResponse,
  CreateCounselResponseSchema,
  CreatePersonaRequest,
  CreatePersonaResponse,
  CreatePersonaResponseSchema,
  CreateToneRequest,
  CreateToneResponse,
  CreateToneResponseSchema,
  ReactMessageRequest,
  ReactMessageResponse,
  ReactMessageResponseSchema,
  UpdatePersonaRequest,
  UpdatePersonaResponse,
  UpdatePersonaResponseSchema,
  UpdateToneRequest,
  UpdateToneResponse,
  UpdateToneResponseSchema,
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

  // @GrpcMethod("CounselService", "CreateMessage")
  // async createCounselMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
  //   const command: CreateMessageCommand = new CreateMessageCommand({
  //     counselId: new UniqueEntityId(request.counselId),
  //     message: request.message,
  //   });
  //   const counselMessage: CounselMessages = await this.commandBus.execute(command);

  //   return create(CreateMessageResponseSchema, {
  //     counselMessage: SchemaCounselsMapper.toCounselMessageProto(counselMessage),
  //   });
  // }

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

  // @GrpcMethod("CounselService", "CreatePrompt")
  // async createCounselPrompt(request: CreatePromptRequest): Promise<CreatePromptResponse> {
  //   const command: CreatePromptCommand = new CreatePromptCommand(request);
  //   const counselPrompt = await this.commandBus.execute(command);

  //   return create(CreatePromptResponseSchema, {
  //     prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
  //   });
  // // }

  // @GrpcMethod("CounselService", "UpdatePrompt")
  // async updateCounselPrompt(request: UpdatePromptRequest): Promise<UpdatePromptResponse> {
  //   const command: UpdatePromptCommand = new UpdatePromptCommand({
  //     promptId: new UniqueEntityId(request.promptId),
  //     persona: request.persona,
  //     context: request.context,
  //     instruction: request.instruction,
  //     tone: request.tone,
  //     additionalPrompt: request.additionalPrompt,
  //     version: request.version,
  //   });
  //   const counselPrompt = await this.commandBus.execute(command);

  //   return create(UpdatePromptResponseSchema, {
  //     prompt: SchemaCounselsMapper.toCounselPromptProto(counselPrompt),
  //   });
  // }

  // @GrpcMethod("CounselService", "CreateCounselor")
  // async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
  //   const command: CreateCounselorCommand = new CreateCounselorCommand({
  //     counselorType: request.counselorType,
  //     name: request.name,
  //     description: request.description,
  //     gender: request.counselorGender,
  //   });
  //   const counselor = await this.commandBus.execute(command);

  //   return create(CreateCounselorResponseSchema, {
  //     counselor: SchemaCounselsMapper.toCounselorProto(counselor),
  //   });
  // }

  // @GrpcMethod("CounselService", "UpdateCounselor")
  // async updateCounselor(request: UpdateCounselorRequest): Promise<UpdateCounselorResponse> {
  //   const command: UpdateCounselorCommand = new UpdateCounselorCommand({
  //     counselorId: new UniqueEntityId(request.counselorId),
  //     counselorType: request.counselorType,
  //     name: request.name,
  //     description: request.description,
  //     gender: request.counselorGender,
  //   });
  //   const counselor = await this.commandBus.execute(command);

  //   return create(UpdateCounselorResponseSchema, {
  //     counselor: SchemaCounselsMapper.toCounselorProto(counselor),
  //   });
  // }

  @GrpcMethod("CounselService", "CreatePersona")
  async createPersona(request: CreatePersonaRequest): Promise<CreatePersonaResponse> {
    const command: CreatePersonaCommand = new CreatePersonaCommand({
      body: request.body,
      counselorId: new UniqueEntityId(request.counselorId),
    });
    const persona: Personas = await this.commandBus.execute(command);
    return create(CreatePersonaResponseSchema, {
      persona: SchemaCounselsMapper.toPersonaProto(persona),
    });
  }

  @GrpcMethod("CounselService", "UpdatePersona")
  async updatePersona(request: UpdatePersonaRequest): Promise<UpdatePersonaResponse> {
    const command: UpdatePersonaCommand = new UpdatePersonaCommand({
      personaId: new UniqueEntityId(request.personaId),
      body: request.body,
    });
    const persona: Personas = await this.commandBus.execute(command);
    return create(UpdatePersonaResponseSchema, {
      persona: SchemaCounselsMapper.toPersonaProto(persona),
    });
  }

  @GrpcMethod("CounselService", "CreateTone")
  async createTone(request: CreateToneRequest): Promise<CreateToneResponse> {
    const command: CreateToneCommand = new CreateToneCommand({
      name: request.name,
      body: request.body,
    });
    const tone: Tones = await this.commandBus.execute(command);
    return create(CreateToneResponseSchema, {
      tone: SchemaCounselsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselService", "UpdateTone")
  async updateTone(request: UpdateToneRequest): Promise<UpdateToneResponse> {
    const command: UpdateToneCommand = new UpdateToneCommand({
      toneId: new UniqueEntityId(request.toneId),
      name: request.name,
      body: request.body,
    });
    const tone: Tones = await this.commandBus.execute(command);
    return create(UpdateToneResponseSchema, {
      tone: SchemaCounselsMapper.toToneProto(tone),
    });
  }
}
