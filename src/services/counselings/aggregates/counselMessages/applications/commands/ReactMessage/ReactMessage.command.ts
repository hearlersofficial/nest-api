import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselMessageReaction } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus } from "@nestjs/common";

export class ReactMessageCommand {
  constructor(public readonly props: ReactMessageCommandProps) {
    this.validateProps(props);
  }

  private validateProps(props: ReactMessageCommandProps): void {
    if (props.messageId === null || props.messageId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "메시지 ID는 필수입니다.");
    }
    if (props.reaction === null || props.reaction === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "반응은 필수입니다.");
    }
    if (!Object.values(CounselMessageReaction).includes(props.reaction)) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유효하지 않은 반응입니다.");
    }
    if (props.reaction === CounselMessageReaction.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "반응이 지정되지 않았습니다.");
    }
  }
}

interface ReactMessageCommandProps {
  messageId: number;
  reaction: CounselMessageReaction;
}
