import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  CreateCounselTechniqueRequest,
  CreateCounselTechniqueResponse,
  CreateCounselTechniqueResponseSchema,
  CreateToneRequest,
  CreateToneResponse,
  CreateToneResponseSchema,
  SaveCounselTechniqueSequenceRequest,
  SaveCounselTechniqueSequenceResponse,
  SaveCounselTechniqueSequenceResponseSchema,
  UpdateCounselTechniqueRequest,
  UpdateCounselTechniqueResponse,
  UpdateCounselTechniqueResponseSchema,
  UpdateToneRequest,
  UpdateToneResponse,
  UpdateToneResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel_prompt")
export class GrpcCounselPromptCommandController {
  constructor(private readonly tonesFacade: TonesFacade, private readonly counselTechniquesFacade: CounselTechniquesFacade) {}

  @GrpcMethod("CounselPromptService", "CreateTone")
  async createTone(request: CreateToneRequest): Promise<CreateToneResponse> {
    const { name, body } = request;
    const tone = await this.tonesFacade.createTone({ name, body });
    return create(CreateToneResponseSchema, {
      tone: SchemaCounselPromptsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselPromptService", "UpdateTone")
  async updateTone(request: UpdateToneRequest): Promise<UpdateToneResponse> {
    const { toneId, name, body } = request;
    const tone = await this.tonesFacade.updateTone({ toneId: new UniqueEntityId(toneId), name, body });
    return create(UpdateToneResponseSchema, {
      tone: SchemaCounselPromptsMapper.toToneProto(tone),
    });
  }

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
    const technique = await this.counselTechniquesFacade.updateCounselTechnique({
      counselTechniqueId: new UniqueEntityId(counselTechniqueId),
      name,
      context,
      instruction,
      messageThreshold,
    });
    return create(UpdateCounselTechniqueResponseSchema, {
      counselTechnique: SchemaCounselPromptsMapper.toCounselTechniqueProto(technique),
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
