import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { LlmRequest } from "~counselings/domains/llm/models/llm-request";
import { LlmResponse, LlmResponseProps } from "~counselings/domains/llm/models/llm-response";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { HttpStatus } from "@nestjs/common";
import { ChatCompletion, ChatCompletionMessageParam, ChatModel } from "openai/resources";

export class OpenAILlmMapper {
  static toMessageParam(request: null): null;
  static toMessageParam(request: LlmRequest): ChatCompletionMessageParam;
  static toMessageParam(request: LlmRequest | null): ChatCompletionMessageParam | null;
  static toMessageParam(request: LlmRequest | null): ChatCompletionMessageParam | null {
    if (!request) {
      return null;
    }

    return {
      role: request.role,
      content: request.content,
    };
  }

  static toMessageParams(requests: LlmRequest[]): ChatCompletionMessageParam[] {
    if (requests.length === 0) {
      return [];
    }
    return requests.map((request) => OpenAILlmMapper.toMessageParam(request)).filter((param) => param !== null);
  }

  static toLlmResponse(completion: ChatCompletion): LlmResponse {
    const llmResponseProps: LlmResponseProps = {
      content: completion.choices[0].message.content,
    };
    const llmResponseOrError = LlmResponse.create(llmResponseProps);
    if (llmResponseOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, llmResponseOrError.errorValue);
    }

    return llmResponseOrError.value;
  }

  static toOpenAIModel(model: GPTModel): ChatModel {
    switch (model) {
      case GPTModel.GPT_3_5_TURBO:
        return "gpt-3.5-turbo";
      case GPTModel.GPT_4:
        return "gpt-4";
      case GPTModel.GPT_4O:
        return "gpt-4o";
      default:
        throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "지원하지 않는 GPT 모델입니다.");
    }
  }
}
