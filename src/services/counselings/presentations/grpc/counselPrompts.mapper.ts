import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";
import { Tones } from "~counselings/domains/tones/models/tones";
import { CounselTechnique, CounselTechniqueSchema, Tone, ToneSchema } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselPromptsMapper {
  static toToneProto(tone: Tones): Tone {
    return create(ToneSchema, {
      id: tone.id.getString(),
      name: tone.name,
      body: tone.body,
      createdAt: tone.createdAt.toISOString(),
      updatedAt: tone.updatedAt.toISOString(),
      deletedAt: tone.deletedAt ? tone.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselTechniqueProto(counselTechnique: CounselTechniques): CounselTechnique {
    return create(CounselTechniqueSchema, {
      id: counselTechnique.id.getString(),
      name: counselTechnique.name,
      toneId: counselTechnique.toneId.getString(),
      context: counselTechnique.context,
      instruction: counselTechnique.instruction,
      messageThreshold: counselTechnique.messageThreshold,
      nextCounselTechniqueId: counselTechnique.nextTechniqueId ? counselTechnique.nextTechniqueId.getString() : undefined,
      createdAt: counselTechnique.createdAt.toISOString(),
      updatedAt: counselTechnique.updatedAt.toISOString(),
      deletedAt: counselTechnique.deletedAt ? counselTechnique.deletedAt.toISOString() : undefined,
    });
  }
}
