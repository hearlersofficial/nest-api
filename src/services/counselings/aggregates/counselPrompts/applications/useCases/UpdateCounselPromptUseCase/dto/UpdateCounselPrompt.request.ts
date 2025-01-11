import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

export interface UpdateCounselPromptUseCaseRequest {
  toUpdateCounselPrompt: CounselPrompts;
}
