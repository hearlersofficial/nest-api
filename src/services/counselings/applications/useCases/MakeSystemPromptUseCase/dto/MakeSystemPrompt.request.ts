import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

export interface MakeSystemPromptUseCaseRequest {
  counselTechnique: CounselTechniques;
  counselor: Counselors;
  userId: UniqueEntityId;
}
