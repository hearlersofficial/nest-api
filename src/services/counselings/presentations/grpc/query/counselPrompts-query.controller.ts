import { CounselPromptManagementsFacade } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  FindActiveVersionRequest,
  FindActiveVersionRequestSchema,
  FindActiveVersionResponse,
  FindActiveVersionResponseSchema,
  FindCounselTechniqueByIdRequest,
  FindCounselTechniqueByIdRequestSchema,
  FindCounselTechniqueByIdResponse,
  FindCounselTechniqueByIdResponseSchema,
  FindGptModelRequest,
  FindGptModelRequestSchema,
  FindGptModelResponse,
  FindGptModelResponseSchema,
  FindOrderedCounselTechniquesRequest,
  FindOrderedCounselTechniquesRequestSchema,
  FindOrderedCounselTechniquesResponse,
  FindOrderedCounselTechniquesResponseSchema,
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
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

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
      promptVersionId: new UniqueEntityId(promptVersionId),
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
      personaPromptId: new UniqueEntityId(personaPromptId),
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
      tonePromptId: new UniqueEntityId(tonePromptId),
    });
    return create(FindTonePromptByIdResponseSchema, {
      tonePrompt: tonePrompt ? SchemaCounselPromptsMapper.toTonePromptProto(tonePrompt) : undefined,
    });
  }

  // Counsel Technique
  @GrpcMethod("CounselPromptService", "FindOrderedCounselTechniques")
  @ProtoRequest(FindOrderedCounselTechniquesRequestSchema)
  async findOrderedCounselTechniques(
    request: FindOrderedCounselTechniquesRequest,
  ): Promise<FindOrderedCounselTechniquesResponse> {
    const { firstCounselTechniqueId } = request;
    const counselTechniques = await this.counselPromptManagementsFacade.findOrderedCounselTechniques({
      firstCounselTechniqueId: new UniqueEntityId(firstCounselTechniqueId),
    });
    return create(FindOrderedCounselTechniquesResponseSchema, {
      counselTechniques: counselTechniques.map((technique) =>
        SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
      ),
    });
  }

  @GrpcMethod("CounselPromptService", "FindCounselTechniqueById")
  @ProtoRequest(FindCounselTechniqueByIdRequestSchema)
  async findCounselTechniqueById(request: FindCounselTechniqueByIdRequest): Promise<FindCounselTechniqueByIdResponse> {
    const { counselTechniqueId } = request;
    const counselTechnique = await this.counselPromptManagementsFacade.findCounselTechniqueById({
      counselTechniqueId: new UniqueEntityId(counselTechniqueId),
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
      promptVersionId: promptVersionId ? new UniqueEntityId(promptVersionId) : undefined,
    });
    return create(FindPromptActivateHistoriesResponseSchema, {
      promptActivateHistories: histories.map((history) =>
        SchemaCounselPromptsMapper.toPromptActivateHistoryProto(history),
      ),
    });
  }

  // GPT Model
  @GrpcMethod("CounselPromptService", "FindGptModel")
  @ProtoRequest(FindGptModelRequestSchema)
  async findGptModel(request: FindGptModelRequest): Promise<FindGptModelResponse> {
    const model = await this.counselPromptManagementsFacade.findGptModel();
    return create(FindGptModelResponseSchema, {
      gptModel: model,
    });
  }
}
