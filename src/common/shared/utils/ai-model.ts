import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

export const convertAiModelToModelName = (aiModel?: AiModel): string | undefined => {
  if (aiModel === undefined) return undefined;
  switch (aiModel) {
    case AiModel.GPT_3_5_TURBO:
      return "gpt-3.5-turbo";
    case AiModel.GPT_4:
      return "gpt-4";
    case AiModel.GPT_4O:
      return "gpt-4o";
    case AiModel.GPT_4O_MINI:
      return "gpt-4o-mini";
    case AiModel.GPT_5_MINI:
      return "gpt-5-mini";
    case AiModel.GPT_5:
      return "gpt-5";
    case AiModel.GPT_5_CHAT:
      return "gpt-5-chat";
    case AiModel.UNSPECIFIED:
      return undefined;
    default:
      return undefined;
  }
};
