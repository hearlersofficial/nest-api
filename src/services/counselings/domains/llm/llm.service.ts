import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { LlmClient } from "~counselings/domains/llm/llm.client";
import { LlmModelManager } from "~counselings/domains/llm/llm-model-manager";
import { LlmRequest, LlmRole } from "~counselings/domains/llm/models/llm-request";
import { LlmResponse } from "~counselings/domains/llm/models/llm-response";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class LlmService {
  constructor(private readonly llmModelManager: LlmModelManager, private readonly llmClient: LlmClient) {}

  createLlmRequest(role: LlmRole, content: string): LlmRequest {
    const llmRequestOrError = LlmRequest.create({
      role,
      content,
    });
    if (llmRequestOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, llmRequestOrError.errorValue);
    }
    return llmRequestOrError.value;
  }

  setModel(model: GPTModel): GPTModel {
    this.llmModelManager.setModel(model);
    return model;
  }

  getModel(): GPTModel {
    return this.llmModelManager.getModel();
  }

  async generateResponse(request: LlmRequest[]): Promise<LlmResponse> {
    const model = this.llmModelManager.getModel();
    return this.llmClient.generateResponse(request, model);
  }
}
