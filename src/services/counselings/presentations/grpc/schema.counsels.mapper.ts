import { formatDayjs } from "~shared/utils/Date.utils";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import {
  Counsel,
  CounselMessage,
  CounselMessageSchema,
  Counselor,
  CounselorSchema,
  CounselPrompt,
  CounselPromptSchema,
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
      lastChatedAt: counsel.lastChatedAt ? formatDayjs(counsel.lastChatedAt) : null,
      createdAt: formatDayjs(counsel.createdAt),
      updatedAt: formatDayjs(counsel.updatedAt),
      deletedAt: counsel.deletedAt ? formatDayjs(counsel.deletedAt) : null,
    });
  }

  static toCounselMessageProto(counselMessage: CounselMessages): CounselMessage {
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? formatDayjs(counselMessage.reactedAt) : null,
      reaction: counselMessage.reaction,
      createdAt: formatDayjs(counselMessage.createdAt),
      updatedAt: formatDayjs(counselMessage.updatedAt),
      deletedAt: counselMessage.deletedAt ? formatDayjs(counselMessage.deletedAt) : null,
    });
  }

  static toCounselPromptProto(counselPrompt: CounselPrompts): CounselPrompt {
    return create(CounselPromptSchema, {
      id: counselPrompt.id.getString(),
      persona: counselPrompt.persona,
      context: counselPrompt.context,
      instruction: counselPrompt.instruction,
      tone: counselPrompt.tone,
      additionalPrompt: counselPrompt.additionalPrompt,
      promptType: counselPrompt.promptType,
      description: counselPrompt.description,
      version: counselPrompt.version,
      createdAt: formatDayjs(counselPrompt.createdAt),
      updatedAt: formatDayjs(counselPrompt.updatedAt),
      deletedAt: counselPrompt.deletedAt ? formatDayjs(counselPrompt.deletedAt) : null,
    });
  }

  static toCounselorProto(counselor: Counselors): Counselor {
    const bubble = counselor.bubble;
    return create(CounselorSchema, {
      id: counselor.id.getString(),
      counselorType: counselor.counselorType,
      name: counselor.name,
      description: counselor.description,
      gender: counselor.gender,
      introMessage: bubble.introMessage,
      responseOption1: bubble.responseOption1,
      responseOption2: bubble.responseOption2,
      createdAt: formatDayjs(counselor.createdAt),
      updatedAt: formatDayjs(counselor.updatedAt),
      deletedAt: counselor.deletedAt ? formatDayjs(counselor.deletedAt) : null,
    });
  }
}
