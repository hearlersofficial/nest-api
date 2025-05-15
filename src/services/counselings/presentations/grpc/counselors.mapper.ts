import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { Tones } from "~counselings/domains/tones/models/tones";
import { Counselor, CounselorSchema, Tone, ToneSchema } from "~proto/com/hearlers/v1/model/counselor_pb";

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
}
