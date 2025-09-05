import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { HttpStatus, Injectable } from "@nestjs/common";
import { convertAiModelToModelName } from "~common/shared/utils/ai-model";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class ChatModelFactory {
  create(aiModel?: AiModel, temperature?: number, streaming: boolean = false): BaseChatModel<ChatOpenAICallOptions> {
    const modelName = convertAiModelToModelName(aiModel) ?? "gpt-4o-mini";
    const finalTemperature = this.handleTemperatureAvailability(aiModel, temperature);

    // NOTE: 현재는 OpenAI 모델만 지원하지만, 추후 다른 모델 제공자를 추가할 수 있습니다.
    // 예: case AiModel.CLAUDE_3: return new ChatAnthropic(...);
    if (this.isOpenAiModel(aiModel)) {
      return new ChatOpenAI({
        modelName,
        temperature: finalTemperature,
        streaming,
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
    }

    throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Unsupported AI model: ${aiModel}`);
  }

  private isOpenAiModel(aiModel?: AiModel): boolean {
    switch (aiModel) {
      case AiModel.GPT_3_5_TURBO:
      case AiModel.GPT_4:
      case AiModel.GPT_4O:
      case AiModel.GPT_4O_MINI:
      case AiModel.GPT_5_MINI:
      case AiModel.GPT_5:
      case AiModel.GPT_5_CHAT:
      case AiModel.UNSPECIFIED:
      case undefined:
        return true;
      default:
        return false;
    }
  }

  /**
   * Temperature 설정 가능 여부를 처리합니다.
   * GPT-5 모델은 온도 설정이 불가능합니다.
   * 따라서 온도를 1로 고정합니다.
   * @param aiModel
   * @param temperature
   * @returns 온도 설정 값
   */
  private handleTemperatureAvailability(aiModel?: AiModel, temperature?: number): number {
    switch (aiModel) {
      case AiModel.GPT_5_MINI:
        return 1;
      case AiModel.GPT_5:
        return 1;
      case AiModel.GPT_5_CHAT:
        return 1;
      default:
        return temperature ?? 0;
    }
  }
}
