import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
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
  FindCounselTechniquesRequest,
  FindCounselTechniquesRequestSchema,
  FindCounselTechniquesResponse,
  FindCounselTechniquesResponseSchema,
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
  FindPersonaPromptsRequest,
  FindPersonaPromptsRequestSchema,
  FindPersonaPromptsResponse,
  FindPersonaPromptsResponseSchema,
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
  FindTonePromptsRequest,
  FindTonePromptsRequestSchema,
  FindTonePromptsResponse,
  FindTonePromptsResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller, Get, Query } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { ProtoRequest } from "~common/shared/utils/rpc";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";

@Controller("counsel_prompt")
export class GrpcCounselPromptQueryController {
  private readonly isCachingEnabled = true; // Boolean flag to enable/disable caching
  private readonly cacheTtl = 60 * 1000; // 1 minute in milliseconds
  private readonly transitionRulesCache = new Map<string, { data: any; timestamp: number }>();

  constructor(private readonly counselPromptManagementsFacade: CounselPromptManagementsFacade) {}

  private generateCacheKey(
    fromCounselTechniqueId?: string,
    toCounselTechniqueId?: string,
    promptVersionId?: string,
  ): string {
    return `transition-rules-${fromCounselTechniqueId || "null"}-${toCounselTechniqueId || "null"}-${promptVersionId || "null"}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTtl;
  }

  private getCachedData(cacheKey: string): any | null {
    if (!this.isCachingEnabled) return null;

    const cached = this.transitionRulesCache.get(cacheKey);
    if (!cached || !this.isCacheValid(cached.timestamp)) {
      this.transitionRulesCache.delete(cacheKey);
      return null;
    }
    return cached.data;
  }

  private setCachedData(cacheKey: string, data: any): void {
    if (!this.isCachingEnabled) return;

    this.transitionRulesCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

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

  @GrpcMethod("CounselPromptService", "FindPersonaPrompts")
  @ProtoRequest(FindPersonaPromptsRequestSchema)
  async findPersonaPrompts(request: FindPersonaPromptsRequest): Promise<FindPersonaPromptsResponse> {
    const { promptVersionId, counselorId } = request;
    const personaPrompts = await this.counselPromptManagementsFacade.findPersonaPrompts({
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
      counselorId: counselorId ? new CounselorId(counselorId) : undefined,
    });
    return create(FindPersonaPromptsResponseSchema, {
      personaPrompts: personaPrompts.map((personaPrompt) =>
        SchemaCounselPromptsMapper.toPersonaPromptProto(personaPrompt),
      ),
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

  @GrpcMethod("CounselPromptService", "FindTonePrompts")
  @ProtoRequest(FindTonePromptsRequestSchema)
  async findTonePrompts(request: FindTonePromptsRequest): Promise<FindTonePromptsResponse> {
    const { promptVersionId, toneId } = request;
    const tonePrompts = await this.counselPromptManagementsFacade.findTonePrompts({
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
      toneId: toneId ? new ToneId(toneId) : undefined,
    });
    return create(FindTonePromptsResponseSchema, {
      tonePrompts: tonePrompts.map((tonePrompt) => SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt)),
    });
  }

  // Counsel Technique
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

  @GrpcMethod("CounselPromptService", "FindCounselTechniques")
  @ProtoRequest(FindCounselTechniquesRequestSchema)
  async findCounselTechniques(request: FindCounselTechniquesRequest): Promise<FindCounselTechniquesResponse> {
    const { promptVersionId, toneId } = request;
    const counselTechniques = await this.counselPromptManagementsFacade.findCounselTechniques({
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
      toneId: toneId ? new ToneId(toneId) : undefined,
    });
    return create(FindCounselTechniquesResponseSchema, {
      counselTechniques: counselTechniques.map((technique) =>
        SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
      ),
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
    const cacheKey = this.generateCacheKey(fromCounselTechniqueId, toCounselTechniqueId, promptVersionId);

    // Try to get cached response
    const cachedResponse = this.getCachedData(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch data from facade
    const transitionRules = await this.counselPromptManagementsFacade.findCounselTechniqueTransitionRules({
      fromCounselTechniqueId: fromCounselTechniqueId ? new CounselTechniqueId(fromCounselTechniqueId) : undefined,
      toCounselTechniqueId: toCounselTechniqueId ? new CounselTechniqueId(toCounselTechniqueId) : undefined,
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
    });

    // Create response with proto mapping
    const response = create(FindCounselTechniqueTransitionRulesResponseSchema, {
      counselTechniqueTransitionRules: transitionRules.map((rule) =>
        SchemaCounselPromptsMapper.toTransitionRuleProto(rule),
      ),
    });

    // Cache the complete response
    this.setCachedData(cacheKey, response);

    return response;
  }

  @Get("counsel-technique-transition-rules")
  async getCounselTechniqueTransitionRules(
    @Query("fromCounselTechniqueId") fromCounselTechniqueId?: string,
    @Query("toCounselTechniqueId") toCounselTechniqueId?: string,
    @Query("promptVersionId") promptVersionId?: string,
  ): Promise<CounselTechniqueTransitionRuleInfo[]> {
    const cacheKey = this.generateCacheKey(fromCounselTechniqueId, toCounselTechniqueId, promptVersionId);

    // Try to get cached data
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Fetch data from facade
    const transitionRules = await this.counselPromptManagementsFacade.findCounselTechniqueTransitionRules({
      fromCounselTechniqueId: fromCounselTechniqueId ? new CounselTechniqueId(fromCounselTechniqueId) : undefined,
      toCounselTechniqueId: toCounselTechniqueId ? new CounselTechniqueId(toCounselTechniqueId) : undefined,
      promptVersionId: promptVersionId ? new PromptVersionId(promptVersionId) : undefined,
    });

    // Cache the data
    this.setCachedData(cacheKey, transitionRules);

    return transitionRules;
  }
}
