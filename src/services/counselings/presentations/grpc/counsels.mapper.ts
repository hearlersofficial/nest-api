import { CounselInfo } from "~counselings/domains/counsels/models/counsel.info";
import { CounselMessageInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { Counsel, CounselMessage, CounselMessageSchema, CounselSchema } from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: null): null;
  static toCounselProto(counsel: CounselInfo): Counsel;
  static toCounselProto(counsel: CounselInfo | null): Counsel | null;
  static toCounselProto(counsel: CounselInfo | null): Counsel | null {
    if (!counsel) {
      return null;
    }
    return create(CounselSchema, {
      id: counsel.id.getString(),
      counselorId: counsel.counselorId,
      userId: counsel.userId.getString(),
      lastMessage: counsel.lastMessage ?? undefined,
      lastChatedAt: counsel.lastChatedAt ? counsel.lastChatedAt.toISOString() : undefined,
      promptVersionId: counsel.promptVersionId,
      counselTechniqueId: counsel.counselTechniqueId,
      counselorUserRelationshipId: counsel.counselorUserRelationshipId,
      createdAt: counsel.createdAt.toISOString(),
      updatedAt: counsel.updatedAt.toISOString(),
      deletedAt: counsel.deletedAt ? counsel.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselMessageProto(counselMessage: null): null;
  static toCounselMessageProto(counselMessage: CounselMessageInfo): CounselMessage;
  static toCounselMessageProto(counselMessage: CounselMessageInfo | null): CounselMessage | null;
  static toCounselMessageProto(counselMessage: CounselMessageInfo | null): CounselMessage | null {
    if (!counselMessage) {
      return null;
    }
    return create(CounselMessageSchema, {
      id: counselMessage.id,
      counselId: counselMessage.counselId,
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? counselMessage.reactedAt.toISOString() : undefined,
      reaction: counselMessage.reaction ?? undefined,
      counselTechniqueId: counselMessage.counselTechniqueId,
      createdAt: counselMessage.createdAt.toISOString(),
      updatedAt: counselMessage.updatedAt.toISOString(),
      deletedAt: counselMessage.deletedAt ? counselMessage.deletedAt.toISOString() : undefined,
    });
  }

  // TODO: counselor user relationship mapper 추가
}
