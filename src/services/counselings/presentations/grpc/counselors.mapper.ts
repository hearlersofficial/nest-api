import { BubblesInfo, CounselorsInfo } from "~counselings/domains/counselors/models/counselors.info";
import { TonesInfo } from "~counselings/domains/tones/models/tones.info";
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
  static toCounselorProto(counselor: null): null;
  static toCounselorProto(counselor: CounselorsInfo): Counselor;
  static toCounselorProto(counselor: CounselorsInfo | null): Counselor | null;
  static toCounselorProto(counselor: CounselorsInfo | null): Counselor | null {
    if (!counselor) {
      return null;
    }
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      toneId: counselor.toneId.getString(),
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      profileImage: counselor.profileImage,
      createdAt: counselor.createdAt.toISOString(),
      updatedAt: counselor.updatedAt.toISOString(),
      deletedAt: counselor.deletedAt ? counselor.deletedAt.toISOString() : undefined,
    });
  }

  static toToneProto(tone: null): null;
  static toToneProto(tone: TonesInfo): Tone;
  static toToneProto(tone: TonesInfo | null): Tone | null;
  static toToneProto(tone: TonesInfo | null): Tone | null {
    if (!tone) {
      return null;
    }
    return create(ToneSchema, {
      id: tone.id.getString(),
      name: tone.name,
      description: tone.description,
      createdAt: tone.createdAt.toISOString(),
      updatedAt: tone.updatedAt.toISOString(),
      deletedAt: tone.deletedAt ? tone.deletedAt.toISOString() : undefined,
    });
  }

  static toBubbleProto(bubble: null): null;
  static toBubbleProto(bubble: BubblesInfo): Bubble;
  static toBubbleProto(bubble: BubblesInfo | null): Bubble | null;
  static toBubbleProto(bubble: BubblesInfo | null): Bubble | null {
    if (!bubble) {
      return null;
    }
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
