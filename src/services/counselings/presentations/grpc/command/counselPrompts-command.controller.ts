import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  ActivatePromptVersionRequest,
  ActivatePromptVersionRequestSchema,
  ActivatePromptVersionResponse,
  ActivatePromptVersionResponseSchema,
  CreateCounselTechniqueRequest,
  CreateCounselTechniqueRequestSchema,
  CreateCounselTechniqueResponse,
  CreateCounselTechniqueResponseSchema,
  DeletePromptVersionsRequest,
  DeletePromptVersionsRequestSchema,
  DeletePromptVersionsResponse,
  DeletePromptVersionsResponseSchema,
  LoadExistingPromptVersionRequest,
  LoadExistingPromptVersionRequestSchema,
  LoadExistingPromptVersionResponse,
  LoadExistingPromptVersionResponseSchema,
  SaveCounselTechniqueSequenceRequest,
  SaveCounselTechniqueSequenceRequestSchema,
  SaveCounselTechniqueSequenceResponse,
  SaveCounselTechniqueSequenceResponseSchema,
  SaveTemporaryVersionRequest,
  SaveTemporaryVersionRequestSchema,
  SaveTemporaryVersionResponse,
  SaveTemporaryVersionResponseSchema,
  SetGptModelRequest,
  SetGptModelRequestSchema,
  SetGptModelResponse,
  SetGptModelResponseSchema,
  UpdateCounselTechniqueRequest,
  UpdateCounselTechniqueRequestSchema,
  UpdateCounselTechniqueResponse,
  UpdateCounselTechniqueResponseSchema,
  UpdatePersonaPromptRequest,
  UpdatePersonaPromptRequestSchema,
  UpdatePersonaPromptResponse,
  UpdatePersonaPromptResponseSchema,
  UpdatePromptVersionRequest,
  UpdatePromptVersionRequestSchema,
  UpdatePromptVersionResponse,
  UpdatePromptVersionResponseSchema,
  UpdateTonePromptRequest,
  UpdateTonePromptRequestSchema,
  UpdateTonePromptResponse,
  UpdateTonePromptResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Controller("counsel_prompt")
export class GrpcCounselPromptCommandController {
  constructor(private readonly counselPromptManagementsFacade: CounselPromptManagementsFacade) {}

  // Prompt Version
  @GrpcMethod("CounselPromptService", "LoadExistingPromptVersion")
  @ProtoRequest(LoadExistingPromptVersionRequestSchema)
  async loadExistingPromptVersion(
    request: LoadExistingPromptVersionRequest,
  ): Promise<LoadExistingPromptVersionResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.counselPromptManagementsFacade.loadExistingPromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
    });
    return create(LoadExistingPromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "SaveTemporaryVersion")
  @ProtoRequest(SaveTemporaryVersionRequestSchema)
  async saveTemporaryVersion(request: SaveTemporaryVersionRequest): Promise<SaveTemporaryVersionResponse> {
    const { name, description, isBookmarked, gptModel } = request;
    const promptVersion = await this.counselPromptManagementsFacade.saveTemporaryPromptVersion({
      name,
      description,
      isBookmarked,
      gptModel,
    });
    return create(SaveTemporaryVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "ActivatePromptVersion")
  @ProtoRequest(ActivatePromptVersionRequestSchema)
  async activatePromptVersion(request: ActivatePromptVersionRequest): Promise<ActivatePromptVersionResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.counselPromptManagementsFacade.activatePromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
    });
    return create(ActivatePromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdatePromptVersion")
  @ProtoRequest(UpdatePromptVersionRequestSchema)
  async updatePromptVersion(request: UpdatePromptVersionRequest): Promise<UpdatePromptVersionResponse> {
    const { promptVersionId, name, description, isBookmarked, gptModel } = request;
    const promptVersion = await this.counselPromptManagementsFacade.updatePromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
      name,
      description,
      isBookmarked,
      gptModel,
    });
    return create(UpdatePromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "DeletePromptVersions")
  @ProtoRequest(DeletePromptVersionsRequestSchema)
  async deletePromptVersions(request: DeletePromptVersionsRequest): Promise<DeletePromptVersionsResponse> {
    const { promptVersionIds } = request;
    await this.counselPromptManagementsFacade.deletePromptVersions({
      promptVersionIds: promptVersionIds.map((id) => new UniqueEntityId(id)),
    });
    return create(DeletePromptVersionsResponseSchema, {});
  }

  // Persona Prompt
  @GrpcMethod("CounselPromptService", "UpdatePersonaPrompt")
  @ProtoRequest(UpdatePersonaPromptRequestSchema)
  async updatePersonaPrompt(request: UpdatePersonaPromptRequest): Promise<UpdatePersonaPromptResponse> {
    const { counselorId, body } = request;
    const personaPrompt = await this.counselPromptManagementsFacade.updatePersonaPrompt({
      counselorId: new UniqueEntityId(counselorId),
      body,
    });
    return create(UpdatePersonaPromptResponseSchema, {
      personaPrompt: SchemaCounselPromptsMapper.toPersonaPromptProto(personaPrompt),
    });
  }

  // Tone Prompt
  @GrpcMethod("CounselPromptService", "UpdateTonePrompt")
  @ProtoRequest(UpdateTonePromptRequestSchema)
  async updateTonePrompt(request: UpdateTonePromptRequest): Promise<UpdateTonePromptResponse> {
    const { toneId, body } = request;
    const tonePrompt = await this.counselPromptManagementsFacade.updateTonePrompt({
      toneId: new UniqueEntityId(toneId),
      body,
    });
    return create(UpdateTonePromptResponseSchema, {
      tonePrompt: SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt),
    });
  }

  // Counsel Technique
  @GrpcMethod("CounselPromptService", "CreateCounselTechnique")
  @ProtoRequest(CreateCounselTechniqueRequestSchema)
  async createCounselTechnique(request: CreateCounselTechniqueRequest): Promise<CreateCounselTechniqueResponse> {
    const { name, toneId, context, instruction, messageThreshold } = request;
    const technique = await this.counselPromptManagementsFacade.createCounselTechnique({
      name,
      toneId: new UniqueEntityId(toneId),
      context,
      instruction,
      messageThreshold,
    });
    return create(CreateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdateCounselTechnique")
  @ProtoRequest(UpdateCounselTechniqueRequestSchema)
  async updateCounselTechnique(request: UpdateCounselTechniqueRequest): Promise<UpdateCounselTechniqueResponse> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = request;
    const techniques = await this.counselPromptManagementsFacade.updateCounselTechnique({
      counselTechniqueId: new UniqueEntityId(counselTechniqueId),
      name,
      context,
      instruction,
      messageThreshold,
    });
    return create(UpdateCounselTechniqueResponseSchema, {
      counselTechniques: techniques.map((technique) => SchemaCounselPromptsMapper.toCounselTechniqueProto(technique)),
    });
  }

  @GrpcMethod("CounselPromptService", "SaveCounselTechniqueSequence")
  @ProtoRequest(SaveCounselTechniqueSequenceRequestSchema)
  async saveCounselTechniqueSequence(
    request: SaveCounselTechniqueSequenceRequest,
  ): Promise<SaveCounselTechniqueSequenceResponse> {
    const { toneId, counselTechniqueIds } = request;
    const counselTechniques = await this.counselPromptManagementsFacade.saveCounselTechniqueSequence({
      toneId: new UniqueEntityId(toneId),
      counselTechniqueIds: counselTechniqueIds.map((id) => new UniqueEntityId(id)),
    });
    return create(SaveCounselTechniqueSequenceResponseSchema, {
      counselTechniques: counselTechniques.map((technique) =>
        SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
      ),
    });
  }

  @GrpcMethod("CounselPromptService", "SetGptModel")
  @ProtoRequest(SetGptModelRequestSchema)
  async setGptModel(request: SetGptModelRequest): Promise<SetGptModelResponse> {
    const { gptModel } = request;
    const setModel = await this.counselPromptManagementsFacade.setGptModel({
      gptModel,
    });
    return create(SetGptModelResponseSchema, {
      gptModel: setModel,
    });
  }
}
