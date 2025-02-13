<<<<<<< HEAD:src/services/counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port.ts
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";
=======
import { CounselPromptType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { CounselPrompts } from "../domain/CounselPrompts";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port.ts

export const COUNSEL_PROMPT_REPOSITORY = Symbol("COUNSEL_PROMPT_REPOSITORY");

export interface CounselPromptsRepositoryPort {
  create(counselPrompt: CounselPrompts): Promise<CounselPrompts>;
  findOne(props: FindOnePropsInCounselPromptsRepository): Promise<CounselPrompts | null>;
  findMany(props: FindManyPropsInCounselPromptsRepository): Promise<CounselPrompts[] | null>;
  update(counselPrompt: CounselPrompts): Promise<CounselPrompts>;
}

export interface FindOnePropsInCounselPromptsRepository {
  promptType?: CounselPromptType;
  id?: UniqueEntityId;
}

export interface FindManyPropsInCounselPromptsRepository {
  promptType?: CounselPromptType;
}
