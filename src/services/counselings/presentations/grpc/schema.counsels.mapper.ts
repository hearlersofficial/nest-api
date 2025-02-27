import { formatDayjsToUtcString } from "~shared/utils/Date.utils";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import {
  Counsel,
  CounselMessage,
  CounselMessageSchema,
  Counselor,
  CounselorSchema,
  CounselSchema,
} from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: Counsels): Counsel {
    return create(CounselSchema, {
      id: counsel.id.getString(),
      userId: counsel.userId.getString(),
      counselorId: counsel.counselorId.getString(),
      lastMessage: counsel.lastMessage,
      lastChatedAt: counsel.lastChatedAt ? formatDayjsToUtcString(counsel.lastChatedAt) : null,
      createdAt: formatDayjsToUtcString(counsel.createdAt),
      updatedAt: formatDayjsToUtcString(counsel.updatedAt),
      deletedAt: counsel.deletedAt ? formatDayjsToUtcString(counsel.deletedAt) : null,
    });
  }

  static toCounselMessageProto(counselMessage: CounselMessages): CounselMessage {
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? formatDayjsToUtcString(counselMessage.reactedAt) : null,
      reaction: counselMessage.reaction,
      createdAt: formatDayjsToUtcString(counselMessage.createdAt),
      updatedAt: formatDayjsToUtcString(counselMessage.updatedAt),
      deletedAt: counselMessage.deletedAt ? formatDayjsToUtcString(counselMessage.deletedAt) : null,
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
      createdAt: formatDayjsToUtcString(counselor.createdAt),
      updatedAt: formatDayjsToUtcString(counselor.updatedAt),
      deletedAt: counselor.deletedAt ? formatDayjsToUtcString(counselor.deletedAt) : null,
    });
  }
}
