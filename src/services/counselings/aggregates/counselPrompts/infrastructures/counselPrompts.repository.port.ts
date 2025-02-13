import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";
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
