import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { SchemaCounselPromptsMapper } from "~counselings/presentations/grpc/counselPrompts.mapper";
import {
  FindCounselTechniqueByIdRequest,
  FindCounselTechniqueByIdResponse,
  FindCounselTechniqueByIdResponseSchema,
  FindCounselTechniquesRequest,
  FindCounselTechniquesResponse,
  FindCounselTechniquesResponseSchema,
  FindToneByIdRequest,
  FindToneByIdResponse,
  FindToneByIdResponseSchema,
  FindTonesRequest,
  FindTonesResponse,
  FindTonesResponseSchema,
} from "~proto/com/hearlers/v1/service/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";

@Controller("counsel_prompt")
export class GrpcCounselPromptQueryController {
  constructor(private readonly tonesFacade: TonesFacade, private readonly counselTechniquesFacade: CounselTechniquesFacade) {}

  @GrpcMethod("CounselPromptService", "FindTones")
  async findTones(data: FindTonesRequest): Promise<FindTonesResponse> {
    const { name } = data;
    const tones = await this.tonesFacade.findTones({ name });
    return create(FindTonesResponseSchema, {
      tones: tones.map((tone) => SchemaCounselPromptsMapper.toToneProto(tone)),
    });
  }

  @GrpcMethod("CounselPromptService", "FindToneById")
  async findToneById(data: FindToneByIdRequest): Promise<FindToneByIdResponse> {
    const { toneId } = data;
    const tone = await this.tonesFacade.findToneById({ toneId: new UniqueEntityId(toneId) });
    return create(FindToneByIdResponseSchema, {
      tone: SchemaCounselPromptsMapper.toToneProto(tone),
    });
  }

  @GrpcMethod("CounselPromptService", "FindCounselTechniques")
  async findCounselTechniques(data: FindCounselTechniquesRequest): Promise<FindCounselTechniquesResponse> {
    const { name, toneId } = data;
    const techniques = await this.counselTechniquesFacade.findCounselTechniques({ name, toneId: new UniqueEntityId(toneId) });
    return create(FindCounselTechniquesResponseSchema, {
      counselTechniques: techniques.map((technique) => SchemaCounselPromptsMapper.toCounselTechniqueProto(technique)),
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
}
