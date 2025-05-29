import { LlmRequest } from "~counselings/domains/llm/models/llm-request";
import { LlmResponse } from "~counselings/domains/llm/models/llm-response";
import { GPTModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

export abstract class LlmClient {
  abstract generateResponse(request: LlmRequest[], model: GPTModel): Promise<LlmResponse>;
}
