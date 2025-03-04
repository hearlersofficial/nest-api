import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { Personas } from "~counselings/aggregates/personas/domain/personas";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import {
  Counsel,
  CounselMessage,
  CounselMessageSchema,
  Counselor,
  CounselorSchema,
  CounselSchema,
  Persona,
  PersonaSchema,
  Tone,
  ToneSchema,
} from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: Counsels): Counsel {
    return create(CounselSchema, {
      id: counsel.id.getString(),
      userId: counsel.userId.getString(),
      counselorId: counsel.counselorId.getString(),
      lastMessage: counsel.lastMessage,
      lastChatedAt: counsel.lastChatedAt ? counsel.lastChatedAt.toISOString() : null,
      createdAt: counsel.createdAt.toISOString(),
      updatedAt: counsel.updatedAt.toISOString(),
      deletedAt: counsel.deletedAt ? counsel.deletedAt.toISOString() : null,
    });
  }

  static toCounselMessageProto(counselMessage: CounselMessages): CounselMessage {
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? counselMessage.reactedAt.toISOString() : null,
      reaction: counselMessage.reaction,
      createdAt: counselMessage.createdAt.toISOString(),
      updatedAt: counselMessage.updatedAt.toISOString(),
      deletedAt: counselMessage.deletedAt ? counselMessage.deletedAt.toISOString() : null,
    });
  }

  static toCounselorProto(counselor: Counselors): Counselor {
    const bubble = counselor.bubble;
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      introMessage: bubble.introMessage,
      responseOption1: bubble.responseOption1,
      responseOption2: bubble.responseOption2,
      createdAt: counselor.createdAt.toISOString(),
      updatedAt: counselor.updatedAt.toISOString(),
      deletedAt: counselor.deletedAt ? counselor.deletedAt.toISOString() : null,
    });
  }

  static toToneProto(tone: Tones): Tone {
    return create(ToneSchema, {
      id: tone.id.getString(),
      name: tone.name,
      body: tone.body,
      createdAt: tone.createdAt.toISOString(),
      updatedAt: tone.updatedAt.toISOString(),
      deletedAt: tone.deletedAt ? tone.deletedAt.toISOString() : null,
    });
  }

  static toPersonaProto(persona: Personas): Persona {
    return create(PersonaSchema, {
      id: persona.id.getString(),
      body: persona.body,
      counselorId: persona.counselorId.getString(),
      createdAt: persona.createdAt.toISOString(),
      updatedAt: persona.updatedAt.toISOString(),
      deletedAt: persona.deletedAt ? persona.deletedAt.toISOString() : null,
    });
  }
}
