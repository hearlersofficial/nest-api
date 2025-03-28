import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { Personas } from "~counselings/domains/counselors/models/personas";
import { Counselor, CounselorSchema, Persona, PersonaSchema } from "~proto/com/hearlers/v1/model/counselor_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselorsMapper {
  static toCounselorProto(counselor: Counselors): Counselor {
    const bubble = counselor.bubble;
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      toneId: counselor.toneId.getString(),
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      persona: SchemaCounselorsMapper.toPersonaProto(counselor.persona),
      introMessage: bubble.introMessage,
      responseOption1: bubble.responseOption1,
      responseOption2: bubble.responseOption2,
      createdAt: counselor.createdAt.toISOString(),
      updatedAt: counselor.updatedAt.toISOString(),
      deletedAt: counselor.deletedAt ? counselor.deletedAt.toISOString() : undefined,
    });
  }

  static toPersonaProto(persona: Personas): Persona {
    return create(PersonaSchema, {
      id: persona.id.getString(),
      body: persona.body,
      counselorId: persona.counselorId.getString(),
      createdAt: persona.createdAt.toISOString(),
      updatedAt: persona.updatedAt.toISOString(),
      deletedAt: persona.deletedAt ? persona.deletedAt.toISOString() : undefined,
    });
  }
}
