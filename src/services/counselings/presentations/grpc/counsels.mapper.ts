import { CounselorUserRelationshipInfo } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationship-info";
import { CounselMessagesInfo } from "~counselings/domains/counsels/models/counsel-message.info";
import { CounselsInfo } from "~counselings/domains/counsels/models/counsels.info";
import {
  Counsel,
  CounselMessage,
  CounselMessageSchema,
  CounselorUserRelationship,
  CounselorUserRelationshipSchema,
  CounselSchema,
} from "~proto/com/hearlers/v1/model/counsel_pb";

import { create } from "@bufbuild/protobuf";

export class SchemaCounselsMapper {
  static toCounselProto(counsel: null): null;
  static toCounselProto(counsel: CounselsInfo): Counsel;
  static toCounselProto(counsel: CounselsInfo | null): Counsel | null;
  static toCounselProto(counsel: CounselsInfo | null): Counsel | null {
    if (!counsel) {
      return null;
    }
    return create(CounselSchema, {
      id: counsel.id.getString(),
      counselorId: counsel.counselorId.getString(),
      userId: counsel.userId.getString(),
      lastMessage: counsel.lastMessage ?? undefined,
      lastChatedAt: counsel.lastChatedAt ? counsel.lastChatedAt.toISOString() : undefined,
      promptVersionId: counsel.promptVersionId.getString(),
      createdAt: counsel.createdAt.toISOString(),
      updatedAt: counsel.updatedAt.toISOString(),
      deletedAt: counsel.deletedAt ? counsel.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselMessageProto(counselMessage: null): null;
  static toCounselMessageProto(counselMessage: CounselMessagesInfo): CounselMessage;
  static toCounselMessageProto(counselMessage: CounselMessagesInfo | null): CounselMessage | null;
  static toCounselMessageProto(counselMessage: CounselMessagesInfo | null): CounselMessage | null {
    if (!counselMessage) {
      return null;
    }
    return create(CounselMessageSchema, {
      id: counselMessage.id.getString(),
      counselId: counselMessage.counselId.getString(),
      message: counselMessage.message,
      isUserMessage: counselMessage.isUserMessage,
      reactedAt: counselMessage.reactedAt ? counselMessage.reactedAt.toISOString() : undefined,
      reaction: counselMessage.reaction ?? undefined,
      counselTechniqueId: counselMessage.counselTechniqueId.getString(),
      createdAt: counselMessage.createdAt.toISOString(),
      updatedAt: counselMessage.updatedAt.toISOString(),
      deletedAt: counselMessage.deletedAt ? counselMessage.deletedAt.toISOString() : undefined,
    });
  }

  static toCounselorUserRelationshipProto(relationship: null): null;
  static toCounselorUserRelationshipProto(relationship: CounselorUserRelationshipInfo): CounselorUserRelationship;
  static toCounselorUserRelationshipProto(
    relationship: CounselorUserRelationshipInfo | null,
  ): CounselorUserRelationship | null {
    if (!relationship) {
      return null;
    }
    return create(CounselorUserRelationshipSchema, {
      id: relationship.id.getString(),
      counselorId: relationship.counselorId.getString(),
      userId: relationship.userId.getString(),
      rapport: relationship.rapport,
      createdAt: relationship.createdAt.toISOString(),
      updatedAt: relationship.updatedAt.toISOString(),
      deletedAt: relationship.deletedAt ? relationship.deletedAt.toISOString() : undefined,
    });
  }
}
