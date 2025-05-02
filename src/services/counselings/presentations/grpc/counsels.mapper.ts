import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { Counsel, CounselMessage, CounselMessageSchema, CounselSchema } from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: Counsels): Counsel {
    return create(CounselSchema, {
      id: counsel.id.getString(),
      counselorId: counsel.counselorId.getString(),
      userId: counsel.userId.getString(),
      lastMessage: counsel.lastMessage ?? undefined,
      lastChatedAt: counsel.lastChatedAt ? counsel.lastChatedAt.toISOString() : undefined,
      promptVersionId: counsel.promptVersionId.getString(),
      counselTechniqueId: counsel.counselTechniqueId.getString(),
      counselorUserRelationshipId: counsel.counselorUserRelationshipId.getString(),
      createdAt: counsel.createdAt.toISOString(),
      updatedAt: counsel.updatedAt.toISOString(),
      deletedAt: counsel.deletedAt ? counsel.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselMessageProto(counselMessage: CounselMessages): CounselMessage {
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? counselMessage.reactedAt.toISOString() : undefined,
      reaction: counselMessage.reaction ?? undefined,
      createdAt: counselMessage.createdAt.toISOString(),
      updatedAt: counselMessage.updatedAt.toISOString(),
      deletedAt: counselMessage.deletedAt ? counselMessage.deletedAt.toISOString() : undefined,
    });
  }

  // TODO: counselor user relationship mapper 추가
}
