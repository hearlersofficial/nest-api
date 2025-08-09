import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

export class AiModelConverter {
  private static readonly AI_MODEL_MAPPING = new Map<AiModel, string>([
    [AiModel.GPT_3_5_TURBO, "gpt-3.5-turbo"],
    [AiModel.GPT_4, "gpt-4"],
    [AiModel.GPT_4O, "gpt-4o"],
    [AiModel.GPT_4O_MINI, "gpt-4o-mini"],
  ]);

  private static readonly STRING_MODEL_MAPPING = new Map<string, AiModel>(
    Array.from(this.AI_MODEL_MAPPING.entries()).map(([key, value]) => [value, key]),
  );

  static convertAiModelToString(aiModel: AiModel): string {
    const modelString = this.AI_MODEL_MAPPING.get(aiModel);
    if (!modelString) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Unsupported AI model: ${aiModel}`);
    }
    return modelString;
  }

  static convertStringToAiModel(modelString: string): AiModel {
    const aiModel = this.STRING_MODEL_MAPPING.get(modelString);
    if (!aiModel) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Unsupported model string: ${modelString}`);
    }
    return aiModel;
  }

  static getSupportedModels(): readonly string[] {
    return Array.from(this.AI_MODEL_MAPPING.values());
  }

  static getSupportedAiModels(): readonly AiModel[] {
    return Array.from(this.AI_MODEL_MAPPING.keys());
  }

  static isValidModelString(modelString: string): boolean {
    return this.STRING_MODEL_MAPPING.has(modelString);
  }

  static isValidAiModel(aiModel: AiModel): boolean {
    return this.AI_MODEL_MAPPING.has(aiModel);
  }
}
