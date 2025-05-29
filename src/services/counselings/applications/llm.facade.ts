import { LlmService } from "~counselings/domains/llm/llm.service";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Injectable } from "@nestjs/common";

@Injectable()
export class LlmFacade {
  constructor(private readonly llmService: LlmService) {}

  async getModel(): Promise<GPTModel> {
    return this.llmService.getModel();
  }

  async setModel(model: GPTModel): Promise<GPTModel> {
    return this.llmService.setModel(model);
  }
}
