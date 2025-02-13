<<<<<<< HEAD:src/services/counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port.ts
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
=======
import { CounselMessages } from "~/src/aggregates/counselMessages/domain/CounselMessages";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselMessages/infrastructures/counselMessages.repository.port.ts

export const COUNSEL_MESSAGE_REPOSITORY = Symbol("COUNSEL_MESSAGE_REPOSITORY");

export interface CounselMessagesRepositoryPort {
  create(counselMessage: CounselMessages): Promise<CounselMessages>;
  findMany(props: FindManyPropsInCounselMessagesRepository): Promise<CounselMessages[]>;
  findOne(props: FindOnePropsInCounselMessagesRepository): Promise<CounselMessages>;
  update(counselMessage: CounselMessages): Promise<CounselMessages>;
}

export interface FindManyPropsInCounselMessagesRepository {
  counselId?: UniqueEntityId;
}

export interface FindOnePropsInCounselMessagesRepository {
  counselMessageId?: UniqueEntityId;
}
