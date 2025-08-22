import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counsel-prompts.mapper";
import {
  FindActiveVersionRequest,
  FindActiveVersionRequestSchema,
  FindActiveVersionResponse,
  FindActiveVersionResponseSchema,
  FindCounselTechniqueByIdRequest,
  FindCounselTechniqueByIdRequestSchema,
  FindCounselTechniqueByIdResponse,
  FindCounselTechniqueByIdResponseSchema,
  FindCounselTechniqueTransitionRuleByIdRequest,
  FindCounselTechniqueTransitionRuleByIdRequestSchema,
  FindCounselTechniqueTransitionRuleByIdResponse,
  FindCounselTechniqueTransitionRuleByIdResponseSchema,
  FindCounselTechniqueTransitionRulesRequest,
  FindCounselTechniqueTransitionRulesRequestSchema,
  FindCounselTechniqueTransitionRulesResponse,
  FindCounselTechniqueTransitionRulesResponseSchema,
  FindPersonaPromptByIdRequest,
  FindPersonaPromptByIdRequestSchema,
  FindPersonaPromptByIdResponse,
  FindPersonaPromptByIdResponseSchema,
  FindPromptActivateHistoriesRequest,
  FindPromptActivateHistoriesRequestSchema,
  FindPromptActivateHistoriesResponse,
  FindPromptActivateHistoriesResponseSchema,
  FindPromptVersionByIdRequest,
  FindPromptVersionByIdRequestSchema,
  FindPromptVersionByIdResponse,
  FindPromptVersionByIdResponseSchema,
  FindPromptVersionsRequest,
  FindPromptVersionsRequestSchema,
  FindPromptVersionsResponse,
  FindPromptVersionsResponseSchema,
  FindTemporaryVersionRequest,
  FindTemporaryVersionRequestSchema,
  FindTemporaryVersionResponse,
  FindTemporaryVersionResponseSchema,
  FindTonePromptByIdRequest,
  FindTonePromptByIdRequestSchema,
  FindTonePromptByIdResponse,
  FindTonePromptByIdResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

@Controller("counsel_prompt")
export class GrpcCounselPromptQueryController {
  constructor(private readonly counselPromptManagementsFacade: CounselPromptManagementsFacade) {}

  // Prompt Version
  @GrpcMethod("CounselPromptService", "FindPromptVersions")
  @ProtoRequest(FindPromptVersionsRequestSchema)
  async findPromptVersions(request: FindPromptVersionsRequest): Promise<FindPromptVersionsResponse> {
    const { name, isBookmarked } = request;
    const promptVersions = await this.counselPromptManagementsFacade.findPromptVersions({
      name,
      isBookmarked,
    });
    return create(FindPromptVersionsResponseSchema, {
      promptVersions: promptVersions.map((version) => SchemaCounselPromptsMapper.toPromptVersionProto(version)),
    });
  }

  @GrpcMethod("CounselPromptService", "FindPromptVersionById")
  @ProtoRequest(FindPromptVersionByIdRequestSchema)
  async findPromptVersionById(request: FindPromptVersionByIdRequest): Promise<FindPromptVersionByIdResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.counselPromptManagementsFacade.findPromptVersionById({
      promptVersionId: new PromptVersionId(promptVersionId),
    });
    return create(FindPromptVersionByIdResponseSchema, {
      promptVersion: promptVersion ? SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion) : undefined,
    });
  }

  @GrpcMethod("CounselPromptService", "FindTemporaryVersion")
  @ProtoRequest(FindTemporaryVersionRequestSchema)
  async findTemporaryVersion(request: FindTemporaryVersionRequest): Promise<FindTemporaryVersionResponse> {
    const promptVersion = await this.counselPromptManagementsFacade.findTemporaryPromptVersion();
    return create(FindTemporaryVersionResponseSchema, {
      promptVersion: promptVersion ? SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion) : undefined,
    });
  }

  @GrpcMethod("CounselPromptService", "FindActiveVersion")
  @ProtoRequest(FindActiveVersionRequestSchema)
  async findActiveVersion(request: FindActiveVersionRequest): Promise<FindActiveVersionResponse> {
    const promptVersion = await this.counselPromptManagementsFacade.findActivePromptVersion();
    return create(FindActiveVersionResponseSchema, {
      promptVersion: promptVersion ? SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion) : undefined,
    });
  }

  // Persona Prompt
  @GrpcMethod("CounselPromptService", "FindPersonaPromptById")
  @ProtoRequest(FindPersonaPromptByIdRequestSchema)
  async findPersonaPromptById(request: FindPersonaPromptByIdRequest): Promise<FindPersonaPromptByIdResponse> {
    const { personaPromptId } = request;
    const personaPrompt = await this.counselPromptManagementsFacade.findPersonaPromptById({
      personaPromptId: new PersonaPromptId(personaPromptId),
    });
    return create(FindPersonaPromptByIdResponseSchema, {
      personaPrompt: personaPrompt ? SchemaCounselPromptsMapper.toPersonaPromptProto(personaPrompt) : undefined,
    });
  }

  // Tone Prompt
  @GrpcMethod("CounselPromptService", "FindTonePromptById")
  @ProtoRequest(FindTonePromptByIdRequestSchema)
  async findTonePromptById(request: FindTonePromptByIdRequest): Promise<FindTonePromptByIdResponse> {
    const { tonePromptId } = request;
    const tonePrompt = await this.counselPromptManagementsFacade.findTonePromptById({
      tonePromptId: new TonePromptId(tonePromptId),
    });
    return create(FindTonePromptByIdResponseSchema, {
      tonePrompt: tonePrompt ? SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt) : undefined,
    });
  }

  @GrpcMethod("CounselPromptService", "FindCounselTechniqueById")
  @ProtoRequest(FindCounselTechniqueByIdRequestSchema)
  async findCounselTechniqueById(request: FindCounselTechniqueByIdRequest): Promise<FindCounselTechniqueByIdResponse> {
    const { counselTechniqueId } = request;
    const counselTechnique = await this.counselPromptManagementsFacade.findCounselTechniqueById({
      counselTechniqueId: new CounselTechniqueId(counselTechniqueId),
    });
    return create(FindCounselTechniqueByIdResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(counselTechnique),
    });
  }

  // Prompt Activate History
  @GrpcMethod("CounselPromptService", "FindPromptActivateHistories")
  @ProtoRequest(FindPromptActivateHistoriesRequestSchema)
  async findPromptActivateHistories(
    request: FindPromptActivateHistoriesRequest,
  ): Promise<FindPromptActivateHistoriesResponse> {
    const { promptVersionId } = request;
    const histories = await this.counselPromptManagementsFacade.findPromptActivateHistories({
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
    });
    return create(FindPromptActivateHistoriesResponseSchema, {
      promptActivateHistories: histories.map((history) =>
        SchemaCounselPromptsMapper.toPromptActivateHistoryProto(history),
      ),
    });
  }

  // Counsel Prompt
  @GrpcMethod("CounselPromptService", "FindCounselTechniqueTransitionRuleById")
  @ProtoRequest(FindCounselTechniqueTransitionRuleByIdRequestSchema)
  async findCounselTechniqueTransitionRuleById(
    request: FindCounselTechniqueTransitionRuleByIdRequest,
  ): Promise<FindCounselTechniqueTransitionRuleByIdResponse> {
    const { counselTechniqueTransitionRuleId } = request;
    const counselPrompt = await this.counselPromptManagementsFacade.findCounselTechniqueTransitionRuleById({
      counselTechniqueTransitionRuleId: new CounselTechniqueTransitionRuleId(counselTechniqueTransitionRuleId),
    });
    return create(FindCounselTechniqueTransitionRuleByIdResponseSchema, {
      counselTechniqueTransitionRule: SchemaCounselPromptsMapper.toTransitionRuleProto(counselPrompt),
    });
  }

  @GrpcMethod("CounselPromptService", "FindCounselTechniqueTransitionRules")
  @ProtoRequest(FindCounselTechniqueTransitionRulesRequestSchema)
  async findCounselTechniqueTransitionRules(
    request: FindCounselTechniqueTransitionRulesRequest,
  ): Promise<FindCounselTechniqueTransitionRulesResponse> {
    const { fromCounselTechniqueId, toCounselTechniqueId, promptVersionId } = request;
    const transitionRules = await this.counselPromptManagementsFacade.findCounselTechniqueTransitionRules({
      fromCounselTechniqueId: fromCounselTechniqueId ? new CounselTechniqueId(fromCounselTechniqueId) : undefined,
      toCounselTechniqueId: toCounselTechniqueId ? new CounselTechniqueId(toCounselTechniqueId) : undefined,
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
    });
    return create(FindCounselTechniqueTransitionRulesResponseSchema, {
      counselTechniqueTransitionRules: transitionRules.map((rule) =>
        SchemaCounselPromptsMapper.toTransitionRuleProto(rule),
      ),
    });
  }
}
