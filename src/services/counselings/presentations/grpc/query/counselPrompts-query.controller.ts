import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { PersonaPromptsFacade } from "~counselings/applications/personaPrompts.facade";
import { PromptActivateHistoryFacade } from "~counselings/applications/promptActivateHistory.facade";
import { PromptVersionsFacade } from "~counselings/applications/promptVersions.facade";
import { TonePromptsFacade } from "~counselings/applications/tonePrompts.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  FindCounselTechniqueByIdRequest,
  FindCounselTechniqueByIdResponse,
  FindCounselTechniqueByIdResponseSchema,
  FindOrderedCounselTechniquesRequest,
  FindOrderedCounselTechniquesResponse,
  FindOrderedCounselTechniquesResponseSchema,
  FindPersonaPromptByIdRequest,
  FindPersonaPromptByIdResponse,
  FindPersonaPromptByIdResponseSchema,
  FindPromptActivateHistoriesRequest,
  FindPromptActivateHistoriesResponse,
  FindPromptActivateHistoriesResponseSchema,
  FindPromptVersionByIdRequest,
  FindPromptVersionByIdResponse,
  FindPromptVersionByIdResponseSchema,
  FindPromptVersionsRequest,
  FindPromptVersionsResponse,
  FindPromptVersionsResponseSchema,
  FindTemporaryVersionRequest,
  FindTemporaryVersionResponse,
  FindTemporaryVersionResponseSchema,
  FindTonePromptByIdRequest,
  FindTonePromptByIdResponse,
  FindTonePromptByIdResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel_prompt")
export class GrpcCounselPromptQueryController {
  constructor(
    private readonly counselTechniquesFacade: CounselTechniquesFacade,
    private readonly promptVersionsFacade: PromptVersionsFacade,
    private readonly personaPromptsFacade: PersonaPromptsFacade,
    private readonly tonePromptsFacade: TonePromptsFacade,
    private readonly promptActivateHistoryService: PromptActivateHistoryFacade,
  ) {}

  // Prompt Version
  @GrpcMethod("CounselPromptService", "FindPromptVersions")
  async findPromptVersions(request: FindPromptVersionsRequest): Promise<FindPromptVersionsResponse> {
    const { name } = request;
    const promptVersions = await this.promptVersionsFacade.findPromptVersions({ name });
    return create(FindPromptVersionsResponseSchema, {
      promptVersions: promptVersions.map((version) => SchemaCounselPromptsMapper.toPromptVersionProto(version)),
    });
  }

  @GrpcMethod("CounselPromptService", "FindPromptVersionById")
  async findPromptVersionById(request: FindPromptVersionByIdRequest): Promise<FindPromptVersionByIdResponse> {
    const { promptVersionId } = request;
    const promptVersion = await this.promptVersionsFacade.findPromptVersionById({
      promptVersionId: new UniqueEntityId(promptVersionId),
    });
    return create(FindPromptVersionByIdResponseSchema, {
      promptVersion: promptVersion ? SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion) : undefined,
    });
  }

  @GrpcMethod("CounselPromptService", "FindTemporaryVersion")
  async findTemporaryVersion(request: FindTemporaryVersionRequest): Promise<FindTemporaryVersionResponse> {
    const promptVersion = await this.promptVersionsFacade.getTemporaryPromptVersion();
    return create(FindTemporaryVersionResponseSchema, {
      promptVersion: promptVersion ? SchemaCounselPromptsMapper.toPromptVersionProto(promptVersion) : undefined,
    });
  }

  // Persona Prompt
  @GrpcMethod("CounselPromptService", "FindPersonaPromptById")
  async findPersonaPromptById(request: FindPersonaPromptByIdRequest): Promise<FindPersonaPromptByIdResponse> {
    const { personaPromptId } = request;
    const personaPrompt = await this.personaPromptsFacade.findPersonaPromptById({
      personaPromptId: new UniqueEntityId(personaPromptId),
    });
    return create(FindPersonaPromptByIdResponseSchema, {
      personaPrompt: personaPrompt ? SchemaCounselPromptsMapper.toPersonaPromptProto(personaPrompt) : undefined,
    });
  }

  // Tone Prompt
  @GrpcMethod("CounselPromptService", "FindTonePromptById")
  async findTonePromptById(request: FindTonePromptByIdRequest): Promise<FindTonePromptByIdResponse> {
    const { tonePromptId } = request;
    const tonePrompt = await this.tonePromptsFacade.findTonePromptById({
      tonePromptId: new UniqueEntityId(tonePromptId),
    });
    return create(FindTonePromptByIdResponseSchema, {
      tonePrompt: tonePrompt ? SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt) : undefined,
    });
  }

  // Counsel Technique
  @GrpcMethod("CounselPromptService", "FindOrderedCounselTechniques")
  async findOrderedCounselTechniques(request: FindOrderedCounselTechniquesRequest): Promise<FindOrderedCounselTechniquesResponse> {
    const { firstCounselTechniqueId } = request;
    const counselTechniques = await this.counselTechniquesFacade.findOrderedCounselTechniques({
      firstCounselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
    });
    return create(FindOrderedCounselTechniquesResponseSchema, {
      counselTechniques: counselTechniques.map((technique) => SchemaCounselPromptsMapper.toCounselTechniqueProto(technique)),
    });
  }

  @GrpcMethod("CounselPromptService", "FindCounselTechniqueById")
  async findCounselTechniqueById(data: FindCounselTechniqueByIdRequest): Promise<FindCounselTechniqueByIdResponse> {
    const { counselTechniqueId } = data;
    const counselTechnique = await this.counselTechniquesFacade.findCounselTechniqueById({ counselTechniqueId: new UniqueEntityId(counselTechniqueId) });
    return create(FindCounselTechniqueByIdResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(counselTechnique),
    });
  }

  // Prompt Activate History
  @GrpcMethod("CounselPromptService", "FindPromptActivateHistories")
  async findPromptActivateHistories(request: FindPromptActivateHistoriesRequest): Promise<FindPromptActivateHistoriesResponse> {
    const { promptVersionId } = request;
    const histories = await this.promptActivateHistoryService.findPromptActivateHistories({
      promptVersionId: promptVersionId ? new UniqueEntityId(promptVersionId) : undefined,
    });
    return create(FindPromptActivateHistoriesResponseSchema, {
      promptActivateHistories: histories.map((history) => SchemaCounselPromptsMapper.toPromptActivateHistoryProto(history)),
    });
  }
}
