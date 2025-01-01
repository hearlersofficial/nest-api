import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";

export const COUNSEL_MESSAGE_REPOSITORY = Symbol("COUNSEL_MESSAGE_REPOSITORY");

export interface CounselMessagesRepositoryPort {
  create(counselMessage: CounselMessages): Promise<CounselMessages>;
  findMany(props: FindManyPropsInCounselMessagesRepository): Promise<CounselMessages[]>;
  findOne(props: FindOnePropsInCounselMessagesRepository): Promise<CounselMessages>;
  update(counselMessage: CounselMessages): Promise<CounselMessages>;
}

export interface FindManyPropsInCounselMessagesRepository {
  counselId?: number;
}

export interface FindOnePropsInCounselMessagesRepository {
  counselMessageId?: number;
}
