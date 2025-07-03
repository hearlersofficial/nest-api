import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

export class GPTModelConverter {
  private static readonly GPT_MODEL_MAPPING = new Map<GPTModel, string>([
    [GPTModel.GPT_3_5_TURBO, "gpt-3.5-turbo"],
    [GPTModel.GPT_4, "gpt-4"],
    [GPTModel.GPT_4O, "gpt-4o"],
  ]);

  private static readonly STRING_MODEL_MAPPING = new Map<string, GPTModel>(
    Array.from(this.GPT_MODEL_MAPPING.entries()).map(([key, value]) => [value, key]),
  );

  static convertGPTModelToString(gptModel: GPTModel): string {
    const modelString = this.GPT_MODEL_MAPPING.get(gptModel);
    if (!modelString) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Unsupported GPT model: ${gptModel}`);
    }
    return modelString;
  }

  static convertStringToGPTModel(modelString: string): GPTModel {
    const gptModel = this.STRING_MODEL_MAPPING.get(modelString);
    if (!gptModel) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Unsupported model string: ${modelString}`);
    }
    return gptModel;
  }

  static getSupportedModels(): readonly string[] {
    return Array.from(this.GPT_MODEL_MAPPING.values());
  }

  static getSupportedGPTModels(): readonly GPTModel[] {
    return Array.from(this.GPT_MODEL_MAPPING.keys());
  }

  static isValidModelString(modelString: string): boolean {
    return this.STRING_MODEL_MAPPING.has(modelString);
  }

  static isValidGPTModel(gptModel: GPTModel): boolean {
    return this.GPT_MODEL_MAPPING.has(gptModel);
  }
}
