import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { ChatCompletionSystemMessageParam } from "openai/resources";

export interface MakeSystemPromptUseCaseRequest {
  counselTechnique: CounselTechniques;
  counselor: Counselors;
  userId: UniqueEntityId;
}

export interface MakeSystemPromptUseCaseResponse extends UseCaseCoreResponse {
  /*
  {
    role: "system",
    content: string,
  }
  */
  prompt?: ChatCompletionSystemMessageParam;
}
