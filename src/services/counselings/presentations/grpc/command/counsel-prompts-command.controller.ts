import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counsel-prompts.mapper";
import {
  ActivatePromptVersionRequest,
  ActivatePromptVersionRequestSchema,
  ActivatePromptVersionResponse,
  ActivatePromptVersionResponseSchema,
  CreateCounselTechniqueRequest,
  CreateCounselTechniqueRequestSchema,
  CreateCounselTechniqueResponse,
  CreateCounselTechniqueResponseSchema,
  CreateCounselTechniqueTransitionRuleRequest,
  CreateCounselTechniqueTransitionRuleRequestSchema,
  CreateCounselTechniqueTransitionRuleResponse,
  CreateCounselTechniqueTransitionRuleResponseSchema,
  DeleteCounselTechniqueTransitionRuleRequest,
  DeleteCounselTechniqueTransitionRuleRequestSchema,
  DeleteCounselTechniqueTransitionRuleResponse,
  DeleteCounselTechniqueTransitionRuleResponseSchema,
  DeletePromptVersionsRequest,
  DeletePromptVersionsRequestSchema,
  DeletePromptVersionsResponse,
  DeletePromptVersionsResponseSchema,
  LoadExistingPromptVersionRequest,
  LoadExistingPromptVersionRequestSchema,
  LoadExistingPromptVersionResponse,
  LoadExistingPromptVersionResponseSchema,
  SaveTemporaryVersionRequest,
  SaveTemporaryVersionRequestSchema,
  SaveTemporaryVersionResponse,
  SaveTemporaryVersionResponseSchema,
  UpdateCounselTechniqueRequest,
  UpdateCounselTechniqueRequestSchema,
  UpdateCounselTechniqueResponse,
  UpdateCounselTechniqueResponseSchema,
  UpdateCounselTechniqueTransitionRuleRequest,
  UpdateCounselTechniqueTransitionRuleRequestSchema,
  UpdateCounselTechniqueTransitionRuleResponse,
  UpdateCounselTechniqueTransitionRuleResponseSchema,
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
import { Controller, Delete, Param } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

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
      promptVersionId: new PromptVersionId(promptVersionId),
    });
    return create(LoadExistingPromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "SaveTemporaryVersion")
  @ProtoRequest(SaveTemporaryVersionRequestSchema)
  async saveTemporaryVersion(request: SaveTemporaryVersionRequest): Promise<SaveTemporaryVersionResponse> {
    const { name, description, isBookmarked, aiModel } = request;
    const promptVersion = await this.counselPromptManagementsFacade.saveTemporaryPromptVersion({
      name,
      description,
      isBookmarked,
      aiModel,
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
      promptVersionId: new PromptVersionId(promptVersionId),
    });
    return create(ActivatePromptVersionResponseSchema, {
      promptVersion: SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdatePromptVersion")
  @ProtoRequest(UpdatePromptVersionRequestSchema)
  async updatePromptVersion(request: UpdatePromptVersionRequest): Promise<UpdatePromptVersionResponse> {
    const { promptVersionId, name, description, isBookmarked, aiModel } = request;
    const promptVersion = await this.counselPromptManagementsFacade.updatePromptVersion({
      promptVersionId: new PromptVersionId(promptVersionId),
      name,
      description,
      isBookmarked,
      aiModel,
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
      promptVersionIds: promptVersionIds.map((id) => new PromptVersionId(id)),
    });
    return create(DeletePromptVersionsResponseSchema, {});
  }

  // Persona Prompt
  @GrpcMethod("CounselPromptService", "UpdatePersonaPrompt")
  @ProtoRequest(UpdatePersonaPromptRequestSchema)
  async updatePersonaPrompt(request: UpdatePersonaPromptRequest): Promise<UpdatePersonaPromptResponse> {
    const { counselorId, body } = request;
    const personaPrompt = await this.counselPromptManagementsFacade.updatePersonaPromptInTemporaryVersion({
      counselorId: new CounselorId(counselorId),
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
    const tonePrompt = await this.counselPromptManagementsFacade.updateTonePromptInTemporaryVersion({
      toneId: new ToneId(toneId),
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
    const { name, temperature, toneId, context, instruction, isStartTechnique } = request;
    const technique = await this.counselPromptManagementsFacade.createCounselTechnique({
      name,
      temperature,
      toneId: new ToneId(toneId),
      context,
      instruction,
      isStartTechnique,
    });
    return create(CreateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdateCounselTechnique")
  @ProtoRequest(UpdateCounselTechniqueRequestSchema)
  async updateCounselTechnique(request: UpdateCounselTechniqueRequest): Promise<UpdateCounselTechniqueResponse> {
    const { counselTechniqueId, name, temperature, context, instruction, isStartTechnique } = request;
    const technique = await this.counselPromptManagementsFacade.updateCounselTechnique({
      counselTechniqueId: new CounselTechniqueId(counselTechniqueId),
      name,
      temperature,
      context,
      instruction,
      isStartTechnique,
    });
    return create(UpdateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
    });
  }

  // Counsel Technique Transition Rule
  @GrpcMethod("CounselPromptService", "CreateCounselTechniqueTransitionRule")
  @ProtoRequest(CreateCounselTechniqueTransitionRuleRequestSchema)
  async createCounselTechniqueTransitionRule(
    request: CreateCounselTechniqueTransitionRuleRequest,
  ): Promise<CreateCounselTechniqueTransitionRuleResponse> {
    const transitionRule = await this.counselPromptManagementsFacade.createCounselTechniqueTransitionRule({
      ...request,
      fromCounselTechniqueId: new CounselTechniqueId(request.fromCounselTechniqueId),
      toCounselTechniqueId: new CounselTechniqueId(request.toCounselTechniqueId),
      minCurrentTechniqueMessageCount: request.minCurrentTechniqueMessageCount ?? null,
      maxCurrentTechniqueMessageCount: request.maxCurrentTechniqueMessageCount ?? null,
      minEmotionIntensity: request.minEmotionIntensity ?? null,
      maxEmotionIntensity: request.maxEmotionIntensity ?? null,
      minSelfEfficacy: request.minSelfEfficacy ?? null,
      maxSelfEfficacy: request.maxSelfEfficacy ?? null,
      minRiskSeverity: request.minRiskSeverity ?? null,
      maxRiskSeverity: request.maxRiskSeverity ?? null,
      requiredPhysicalSymptomsPresent: request.requiredPhysicalSymptomsPresent ?? null,
      requiredConsentToDepth: request.requiredConsentToDepth ?? null,
    });
    return create(CreateCounselTechniqueTransitionRuleResponseSchema, {
      counselTechniqueTransitionRule: SchemaCounselPromptsMapper.toTransitionRuleProto(transitionRule),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdateCounselTechniqueTransitionRule")
  @ProtoRequest(UpdateCounselTechniqueTransitionRuleRequestSchema)
  async updateCounselTechniqueTransitionRule(
    request: UpdateCounselTechniqueTransitionRuleRequest,
  ): Promise<UpdateCounselTechniqueTransitionRuleResponse> {
    const transitionRule = await this.counselPromptManagementsFacade.updateCounselTechniqueTransitionRule({
      ...request,
      counselTechniqueTransitionRuleId: new CounselTechniqueTransitionRuleId(request.counselTechniqueTransitionRuleId),
      minCurrentTechniqueMessageCount: request.minCurrentTechniqueMessageCount ?? null,
      maxCurrentTechniqueMessageCount: request.maxCurrentTechniqueMessageCount ?? null,
      minEmotionIntensity: request.minEmotionIntensity ?? null,
      maxEmotionIntensity: request.maxEmotionIntensity ?? null,
      minSelfEfficacy: request.minSelfEfficacy ?? null,
      maxSelfEfficacy: request.maxSelfEfficacy ?? null,
      minRiskSeverity: request.minRiskSeverity ?? null,
      maxRiskSeverity: request.maxRiskSeverity ?? null,
      requiredPhysicalSymptomsPresent: request.requiredPhysicalSymptomsPresent ?? null,
      requiredConsentToDepth: request.requiredConsentToDepth ?? null,
    });
    return create(UpdateCounselTechniqueTransitionRuleResponseSchema, {
      counselTechniqueTransitionRule: SchemaCounselPromptsMapper.toTransitionRuleProto(transitionRule),
    });
  }

  @GrpcMethod("CounselPromptService", "DeleteCounselTechniqueTransitionRule")
  @ProtoRequest(DeleteCounselTechniqueTransitionRuleRequestSchema)
  async deleteCounselTechniqueTransitionRule(
    request: DeleteCounselTechniqueTransitionRuleRequest,
  ): Promise<DeleteCounselTechniqueTransitionRuleResponse> {
    const { counselTechniqueTransitionRuleId } = request;
    await this.counselPromptManagementsFacade.deleteCounselTechniqueTransitionRuleById({
      counselTechniqueTransitionRuleId: new CounselTechniqueTransitionRuleId(counselTechniqueTransitionRuleId),
    });
    return create(DeleteCounselTechniqueTransitionRuleResponseSchema, {});
  }

  @Delete("counsel-technique-transition-rule/:counselTechniqueTransitionRuleId")
  async deleteCounselTechniqueTransitionRuleHttp(
    @Param("counselTechniqueTransitionRuleId") counselTechniqueTransitionRuleId: string,
  ): Promise<any> {
    await this.counselPromptManagementsFacade.deleteCounselTechniqueTransitionRuleById({
      counselTechniqueTransitionRuleId: new CounselTechniqueTransitionRuleId(counselTechniqueTransitionRuleId),
    });
    // For HTTP, return a standard response (could be 204 No Content or a JSON object)
    return { success: true };
  }
}
