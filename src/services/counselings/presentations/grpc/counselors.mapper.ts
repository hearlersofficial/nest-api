import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { Tones } from "~counselings/domains/tones/models/tones";
import {
  Bubble,
  BubbleSchema,
  Counselor,
  CounselorSchema,
  Tone,
  ToneSchema,
} from "~proto/com/hearlers/v1/model/counselor_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselorsMapper {
  static toCounselorProto(counselor: Counselors): Counselor {
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      toneId: counselor.toneId.getString(),
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      createdAt: counselor.createdAt.toISOString(),
      updatedAt: counselor.updatedAt.toISOString(),
      deletedAt: counselor.deletedAt ? counselor.deletedAt.toISOString() : undefined,
    });
  }

  static toToneProto(tone: Tones): Tone {
    return create(ToneSchema, {
      id: tone.id.getString(),
      name: tone.name,
      description: tone.description,
      createdAt: tone.createdAt.toISOString(),
      updatedAt: tone.updatedAt.toISOString(),
      deletedAt: tone.deletedAt ? tone.deletedAt.toISOString() : undefined,
    });
  }

  static toBubbleProto(bubble: Bubbles): Bubble {
    return create(BubbleSchema, {
      id: bubble.id.getString(),
      question: bubble.question,
      responseOption1: bubble.responseOption1,
      responseOption2: bubble.responseOption2,
      createdAt: bubble.createdAt.toISOString(),
      updatedAt: bubble.updatedAt.toISOString(),
      deletedAt: bubble.deletedAt ? bubble.deletedAt.toISOString() : undefined,
    });
  }
}
