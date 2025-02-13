import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { isValidVersion } from "~shared/types/version.type";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counselPrompts/applications/commands/UpdatePrompt/UpdatePrompt.command.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { isValidVersion } from "~/src/shared/types/version.type";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselPrompts/applications/commands/UpdatePrompt/UpdatePrompt.command.ts

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
  promptId: UniqueEntityId;
  persona?: string;
  context?: string;
  instruction?: string;
  tone?: string;
  additionalPrompt?: string;
  description?: string;
  version?: string;
}
