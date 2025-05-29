import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Injectable } from "@nestjs/common";

@Injectable()
export class LlmModelManager {
  private currentModel: GPTModel = GPTModel.GPT_4;

  setModel(model: GPTModel): void {
    this.currentModel = model;
  }

  getModel(): GPTModel {
    return this.currentModel;
  }
}
