import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { PersonaPromptsFacade } from "~counselings/applications/personaPrompts.facade";
import { PromptVersionsFacade } from "~counselings/applications/promptVersions.facade";
import { TonePromptsFacade } from "~counselings/applications/tonePrompts.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  ActivatePromptVersionRequest,
  ActivatePromptVersionResponse,
  ActivatePromptVersionResponseSchema,
  CreateCounselTechniqueRequest,
  CreateCounselTechniqueResponse,
  CreateCounselTechniqueResponseSchema,
  DeletePromptVersionsRequest,
  DeletePromptVersionsResponse,
  DeletePromptVersionsResponseSchema,
  LoadExistingPromptVersionRequest,
  LoadExistingPromptVersionResponse,
  LoadExistingPromptVersionResponseSchema,
  SaveCounselTechniqueSequenceRequest,
  SaveCounselTechniqueSequenceResponse,
  SaveCounselTechniqueSequenceResponseSchema,
  SaveTemporaryVersionRequest,
  SaveTemporaryVersionResponse,
  SaveTemporaryVersionResponseSchema,
  UpdateCounselTechniqueRequest,
  UpdateCounselTechniqueResponse,
  UpdateCounselTechniqueResponseSchema,
  UpdatePersonaPromptRequest,
  UpdatePersonaPromptResponse,
  UpdatePersonaPromptResponseSchema,
  UpdatePromptVersionRequest,
  UpdatePromptVersionResponse,
  UpdatePromptVersionResponseSchema,
  UpdateTonePromptRequest,
  UpdateTonePromptResponse,
  UpdateTonePromptResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel_prompt")
export class GrpcCounselPromptCommandController {
  constructor(
    private readonly counselTechniquesFacade: CounselTechniquesFacade,
    private readonly promptVersionsFacade: PromptVersionsFacade,
    private readonly personaPromptsFacade: PersonaPromptsFacade,
    private readonly tonePromptsFacade: TonePromptsFacade,
  ) {}

  // Prompt Version
  @GrpcMethod("CounselPromptService", "LoadExistingPromptVersion")
  async loadExistingPromptVersion(request: LoadExistingPromptVersionRequest): Promise<LoadExistingPromptVersionResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.promptVersionsFacade.loadExistingPromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
    });
    return create(LoadExistingPromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "SaveTemporaryVersion")
  async saveTemporaryVersion(request: SaveTemporaryVersionRequest): Promise<SaveTemporaryVersionResponse> {
    const { name, description, isBookmarked } = request;
    const promptVersion = await this.promptVersionsFacade.saveTemporaryVersion({ name, description, isBookmarked });
    return create(SaveTemporaryVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "ActivatePromptVersion")
  async activatePromptVersion(request: ActivatePromptVersionRequest): Promise<ActivatePromptVersionResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.promptVersionsFacade.activatePromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
    });
    return create(ActivatePromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdatePromptVersion")
  async updatePromptVersion(request: UpdatePromptVersionRequest): Promise<UpdatePromptVersionResponse> {
    const { promptVersionId, name, description, isBookmarked } = request;
    const promptVersion = await this.promptVersionsFacade.updatePromptVersion({
      promptVersionId: new UniqueEntityId(promptVersionId),
      name,
      description,
      isBookmarked,
    });
    return create(UpdatePromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "DeletePromptVersions")
  async deletePromptVersions(request: DeletePromptVersionsRequest): Promise<DeletePromptVersionsResponse> {
    const { promptVersionIds } = request;
    await this.promptVersionsFacade.deletePromptVersions({
      promptVersionIds: promptVersionIds.map((id) => new UniqueEntityId(id)),
    });
    return create(DeletePromptVersionsResponseSchema, {});
  }

  // Persona Prompt
  @GrpcMethod("CounselPromptService", "UpdatePersonaPrompt")
  async updatePersonaPrompt(request: UpdatePersonaPromptRequest): Promise<UpdatePersonaPromptResponse> {
    const { counselorId, body } = request;
    const personaPrompt = await this.personaPromptsFacade.updatePersonaPrompt({
      counselorId: new UniqueEntityId(counselorId),
      body,
    });
    return create(UpdatePersonaPromptResponseSchema, {
      personaPrompt: SchemaCounselPromptsMapper.toPersonaPromptProto(personaPrompt),
    });
  }

  // Tone Prompt
  @GrpcMethod("CounselPromptService", "UpdateTonePrompt")
  async updateTonePrompt(request: UpdateTonePromptRequest): Promise<UpdateTonePromptResponse> {
    const { toneId, body } = request;
    const tonePrompt = await this.tonePromptsFacade.updateTonePrompt({
      toneId: new UniqueEntityId(toneId),
      body,
    });
    return create(UpdateTonePromptResponseSchema, {
      tonePrompt: SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt),
    });
  }

  // Counsel Technique
  @GrpcMethod("CounselPromptService", "CreateCounselTechnique")
  async createCounselTechnique(request: CreateCounselTechniqueRequest): Promise<CreateCounselTechniqueResponse> {
    const { name, toneId, context, instruction, messageThreshold } = request;
    const technique = await this.counselTechniquesFacade.createCounselTechnique({
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
  async updateCounselTechnique(request: UpdateCounselTechniqueRequest): Promise<UpdateCounselTechniqueResponse> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = request;
    const techniques = await this.counselTechniquesFacade.updateCounselTechnique({
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
  async saveCounselTechniqueSequence(request: SaveCounselTechniqueSequenceRequest): Promise<SaveCounselTechniqueSequenceResponse> {
    const { toneId, counselTechniqueIds } = request;
    const counselTechniques = await this.counselTechniquesFacade.saveCounselTechniqueSequence({
      toneId: new UniqueEntityId(toneId),
      counselTechniqueIds: counselTechniqueIds.map((id) => new UniqueEntityId(id)),
    });
    return create(SaveCounselTechniqueSequenceResponseSchema, {
      counselTechniques: counselTechniques.map((technique) => SchemaCounselPromptsMapper.toCounselTechniqueProto(technique)),
    });
  }
}
