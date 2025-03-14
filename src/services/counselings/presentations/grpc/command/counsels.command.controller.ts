import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CreateContextCommand } from "~counselings/aggregates/contexts/applications/commands/CreateContext/CreateContext.command";
import { UpdateContextCommand, UpdateContextCommandProps } from "~counselings/aggregates/contexts/applications/commands/UpdateContext/UpdateContext.command";
import { Contexts } from "~counselings/aggregates/contexts/domain/contexts";
import { ReactMessageCommand } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.command";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { CreateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.command";
import { UpdateCounselorCommand } from "~counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.command";
import { CreateCounselTechniqueCommand } from "~counselings/aggregates/counselTechniques/applications/commands/CreateCounselTechnique/CreateCounselTechnique.command";
import {
  SaveCounselTechniqueSequenceCommand,
  SaveCounselTechniqueSequenceCommandResponse,
} from "~counselings/aggregates/counselTechniques/applications/commands/SaveCounselTechniqueSequence/SaveCounselTechniqueSequence.command";
import {
  UpdateCounselTechniqueCommand,
  UpdateCounselTechniqueCommandProps,
} from "~counselings/aggregates/counselTechniques/applications/commands/UpdateCounselTechnique/UpdateCounselTechnique.command";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { CreateInstructionItemCommand } from "~counselings/aggregates/instructionItems/applications/commands/CreateInstructionItem/CreateInstructionItem.command";
import { UpdateInstructionItemCommand } from "~counselings/aggregates/instructionItems/applications/commands/UpdateInstructionItem/UpdateInstructionItem.command";
import { InstructionItems } from "~counselings/aggregates/instructionItems/domain/instructionItems";
import { CreatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/CreatePersona/CreatePersona.command";
import { UpdatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/UpdatePersona/UpdatePersona.command";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { CreateToneCommand } from "~counselings/aggregates/tones/applications/commands/CreateTone/CreateTone.command";
import { UpdateToneCommand } from "~counselings/aggregates/tones/applications/commands/UpdateTone/UpdateTone.command";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { CreateCounselCommand, CreateCounselCommandResult } from "~counselings/applications/commands/CreateCounsel/CreateCounsel.command";
import { CreateInstructionCommand, CreateInstructionCommandResult } from "~counselings/applications/commands/CreateInstruction/CreateInstruction.command";
import { CreateMessageCommand, CreateMessageCommandResult } from "~counselings/applications/commands/CreateMessage/CreateMessage.command";
import {
  UpdateInstructionCommand,
  UpdateInstructionCommandProps,
  UpdateInstructionCommandResult,
} from "~counselings/applications/commands/UpdateInstruction/UpdateInstruction.command";
import { SchemaCounselsMapper } from "~counselings/presentations/grpc/schema.counsels.mapper";
import {
  CreateContextRequest,
  CreateContextResponse,
  CreateContextResponseSchema,
  CreateCounselorRequest,
  CreateCounselorResponse,
  CreateCounselorResponseSchema,
  CreateCounselRequest,
  CreateCounselResponse,
  CreateCounselResponseSchema,
  CreateCounselTechniqueRequest,
  CreateCounselTechniqueResponse,
  CreateCounselTechniqueResponseSchema,
  CreateInstructionItemRequest,
  CreateInstructionItemResponse,
  CreateInstructionItemResponseSchema,
  CreateInstructionRequest,
  CreateInstructionResponse,
  CreateInstructionResponseSchema,
  CreateMessageRequest,
  CreateMessageResponse,
  CreateMessageResponseSchema,
  CreatePersonaRequest,
  CreatePersonaResponse,
  CreatePersonaResponseSchema,
  CreateToneRequest,
  CreateToneResponse,
  CreateToneResponseSchema,
  ReactMessageRequest,
  ReactMessageResponse,
  ReactMessageResponseSchema,
  SaveCounselTechniqueSequenceRequest,
  SaveCounselTechniqueSequenceResponse,
  SaveCounselTechniqueSequenceResponseSchema,
  UpdateContextRequest,
  UpdateContextResponse,
  UpdateContextResponseSchema,
  UpdateCounselorRequest,
  UpdateCounselorResponse,
  UpdateCounselorResponseSchema,
  UpdateCounselTechniqueRequest,
  UpdateCounselTechniqueResponse,
  UpdateCounselTechniqueResponseSchema,
  UpdateInstructionItemRequest,
  UpdateInstructionItemResponse,
  UpdateInstructionItemResponseSchema,
  UpdateInstructionRequest,
  UpdateInstructionResponse,
  UpdateInstructionResponseSchema,
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
      counselMessages: counselMessages.map((counselMessage) => SchemaCounselsMapper.toCounselMessageProto(counselMessage)),
    });
  }

  @GrpcMethod("CounselService", "CreateMessage")
  async createCounselMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    const command: CreateMessageCommand = new CreateMessageCommand({
      counselId: new UniqueEntityId(request.counselId),
      message: request.message,
    });
    const { createdCounselMessage, counselorResponseMessage }: CreateMessageCommandResult = await this.commandBus.execute(command);

    return create(CreateMessageResponseSchema, {
      createdCounselMessage: SchemaCounselsMapper.toCounselMessageProto(createdCounselMessage),
      counselorResponseMessage: SchemaCounselsMapper.toCounselMessageProto(counselorResponseMessage),
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

  @GrpcMethod("CounselService", "CreateCounselor")
  async createCounselor(request: CreateCounselorRequest): Promise<CreateCounselorResponse> {
    const command: CreateCounselorCommand = new CreateCounselorCommand({
      toneId: new UniqueEntityId(request.toneId),
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
      toneId: request.toneId ? new UniqueEntityId(request.toneId) : undefined,
      name: request.name,
      description: request.description,
      gender: request.counselorGender,
    });
    const counselor = await this.commandBus.execute(command);

    return create(UpdateCounselorResponseSchema, {
      counselor: SchemaCounselsMapper.toCounselorProto(counselor),
    });
  }

  @GrpcMethod("CounselService", "CreateCounselTechnique")
  async createCounselTechnique(request: CreateCounselTechniqueRequest): Promise<CreateCounselTechniqueResponse> {
    const command: CreateCounselTechniqueCommand = new CreateCounselTechniqueCommand({
      name: request.name,
      toneId: request.toneId ? new UniqueEntityId(request.toneId) : null,
      contextId: new UniqueEntityId(request.contextId),
      instructionId: new UniqueEntityId(request.instructionId),
      counselTechniqueStage: request.counselTechniqueStage,
    });
    const counselTechnique: CounselTechniques = await this.commandBus.execute(command);
    return create(CreateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselsMapper.toCounselTechniqueProto(counselTechnique),
    });
  }

  @GrpcMethod("CounselService", "UpdateCounselTechnique")
  async updateCounselTechnique(request: UpdateCounselTechniqueRequest): Promise<UpdateCounselTechniqueResponse> {
    const props: UpdateCounselTechniqueCommandProps = {
      techniqueId: new UniqueEntityId(request.counselTechniqueId),
      name: request.name,
      contextId: new UniqueEntityId(request.contextId),
      instructionId: new UniqueEntityId(request.instructionId),
      counselTechniqueStage: request.counselTechniqueStage,
    };
    if (request.hasTone) {
      props.toneId = request.toneId ? new UniqueEntityId(request.toneId) : null;
    }
    const command: UpdateCounselTechniqueCommand = new UpdateCounselTechniqueCommand(props);
    const counselTechnique: CounselTechniques = await this.commandBus.execute(command);
    return create(UpdateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselsMapper.toCounselTechniqueProto(counselTechnique),
    });
  }

  @GrpcMethod("CounselService", "SaveCounselTechniqueSequence")
  async saveCounselTechniqueSequence(request: SaveCounselTechniqueSequenceRequest): Promise<SaveCounselTechniqueSequenceResponse> {
    const command: SaveCounselTechniqueSequenceCommand = new SaveCounselTechniqueSequenceCommand({
      counselTechniqueIds: request.counselTechniqueIds.map((id) => new UniqueEntityId(id)),
    });
    const { counselTechniques }: SaveCounselTechniqueSequenceCommandResponse = await this.commandBus.execute(command);
    return create(SaveCounselTechniqueSequenceResponseSchema, {
      counselTechniques: counselTechniques.map(SchemaCounselsMapper.toCounselTechniqueProto),
    });
  }

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

  @GrpcMethod("CounselService", "CreateContext")
  async createContext(request: CreateContextRequest): Promise<CreateContextResponse> {
    const command: CreateContextCommand = new CreateContextCommand({
      name: request.name,
      body: request.body,
      placeholders: request.placeholders,
    });
    const context: Contexts = await this.commandBus.execute(command);
    return create(CreateContextResponseSchema, {
      context: SchemaCounselsMapper.toContextProto(context),
    });
  }

  @GrpcMethod("CounselService", "UpdateContext")
  async updateContext(request: UpdateContextRequest): Promise<UpdateContextResponse> {
    const props: UpdateContextCommandProps = {
      contextId: new UniqueEntityId(request.contextId),
      name: request.name,
      body: request.body,
    };
    if (request.hasPlaceholders) {
      props.placeholders = request.placeholders;
    }
    const command: UpdateContextCommand = new UpdateContextCommand(props);
    const context: Contexts = await this.commandBus.execute(command);
    return create(UpdateContextResponseSchema, {
      context: SchemaCounselsMapper.toContextProto(context),
    });
  }

  @GrpcMethod("CounselService", "CreateInstruction")
  async createInstruction(request: CreateInstructionRequest): Promise<CreateInstructionResponse> {
    const command: CreateInstructionCommand = new CreateInstructionCommand({
      name: request.name,
      initialSentence: request.initialSentence ?? null,
      instructionItemIds: request.instructionItemIds.map((instructionItemId) => new UniqueEntityId(instructionItemId)),
    });
    const { instruction, instructionItems }: CreateInstructionCommandResult = await this.commandBus.execute(command);
    return create(CreateInstructionResponseSchema, {
      instruction: SchemaCounselsMapper.toInstructionProto(instruction, instructionItems),
    });
  }

  @GrpcMethod("CounselService", "UpdateInstruction")
  async updateInstruction(request: UpdateInstructionRequest): Promise<UpdateInstructionResponse> {
    const props: UpdateInstructionCommandProps = {
      instructionId: new UniqueEntityId(request.instructionId),
      name: request.name,
    };
    if (request.hasInitialSentence) {
      props.initialSentence = request.initialSentence ?? null;
    }
    if (request.hasInstructionItemIds) {
      props.instructionItemIds = request.instructionItemIds.map((instructionItemId) => new UniqueEntityId(instructionItemId));
    }
    const command: UpdateInstructionCommand = new UpdateInstructionCommand({
      instructionId: new UniqueEntityId(request.instructionId),
      name: request.name,
      initialSentence: request.initialSentence,
      instructionItemIds: request.instructionItemIds.map((instructionItemId) => new UniqueEntityId(instructionItemId)),
    });
    const { instruction, instructionItems }: UpdateInstructionCommandResult = await this.commandBus.execute(command);
    return create(UpdateInstructionResponseSchema, {
      instruction: SchemaCounselsMapper.toInstructionProto(instruction, instructionItems),
    });
  }

  @GrpcMethod("CounselService", "CreateInstructionItem")
  async createInstructionItem(request: CreateInstructionItemRequest): Promise<CreateInstructionItemResponse> {
    const command: CreateInstructionItemCommand = new CreateInstructionItemCommand({
      body: request.body,
    });
    const instructionItem: InstructionItems = await this.commandBus.execute(command);
    return create(CreateInstructionItemResponseSchema, {
      instructionItem: SchemaCounselsMapper.toInstructionItemProto(instructionItem),
    });
  }

  @GrpcMethod("CounselService", "UpdateInstructionItem")
  async updateInstructionItem(request: UpdateInstructionItemRequest): Promise<UpdateInstructionItemResponse> {
    const command: UpdateInstructionItemCommand = new UpdateInstructionItemCommand({
      instructionItemId: new UniqueEntityId(request.instructionItemId),
      body: request.body,
    });
    const instructionItem: InstructionItems = await this.commandBus.execute(command);
    return create(UpdateInstructionItemResponseSchema, {
      instructionItem: SchemaCounselsMapper.toInstructionItemProto(instructionItem),
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
