import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isValidVersion } from "~shared/types/version.type";
import { CounselPromptType } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export class CreatePromptCommand {
  constructor(public readonly props: CreatePromptCommandProps) {
    this.validate(props);
  }

  private validate(props: CreatePromptCommandProps): void {
    if (props.promptType === null || props.promptType === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "프롬프트 타입은 필수입니다.");
    }
    if (!Object.values(CounselPromptType).includes(props.promptType)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 프롬프트 타입입니다.");
    }
    if (props.promptType === CounselPromptType.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "프롬프트 타입이 지정되지 않았습니다.");
    }

    if (props.version !== null && props.version !== undefined && !isValidVersion(props.version)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 version입니다");
    }
  }
}

interface CreatePromptCommandProps {
  persona?: string;
  context?: string;
  instruction?: string;
  tone?: string;
  additionalPrompt?: string;
  promptType: CounselPromptType;
  description?: string;
  version?: string;
}
