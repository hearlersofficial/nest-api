import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isValidVersion } from "~shared/types/version.type";

import { HttpStatus } from "@nestjs/common";

export class UpdatePromptCommand {
  constructor(public readonly props: UpdatePromptCommandProps) {
    this.validate(props);
  }

  private validate(props: UpdatePromptCommandProps): void {
    if (props.promptId === null || props.promptId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "프롬프트 ID는 필수입니다.");
    }

    if (props.version !== null && props.version !== undefined && !isValidVersion(props.version)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 version입니다");
    }
  }
}

interface UpdatePromptCommandProps {
  promptId: number;
  persona?: string;
  context?: string;
  instruction?: string;
  tone?: string;
  additionalPrompt?: string;
  description?: string;
  version?: string;
}
