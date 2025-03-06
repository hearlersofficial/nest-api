import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

export const COUNSEL_MESSAGE_REPOSITORY = Symbol("COUNSEL_MESSAGE_REPOSITORY");

export interface CounselMessagesRepositoryPort {
  create(counselMessage: CounselMessages): Promise<CounselMessages>;
  update(counselMessage: CounselMessages): Promise<CounselMessages>;
  findOne(counselMessageId: UniqueEntityId): Promise<CounselMessages | null>;
  findAll(): Promise<CounselMessages[]>;
  findMany(props: FindManyPropsInCounselMessagesRepository): Promise<CounselMessages[]>;
}

export interface FindManyPropsInCounselMessagesRepository {
  counselId?: UniqueEntityId;
}
