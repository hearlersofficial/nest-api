import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

export class CreateMessageCommand {
  constructor(public readonly props: CreateMessageCommandProps) {
    this.validate(props);
  }

  private validate(props: CreateMessageCommandProps): void {
    if (props.counselId === null || props.counselId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담 ID는 필수입니다.");
    }
    if (props.message === null || props.message === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "메시지는 필수입니다.");
    }
  }
}

interface CreateMessageCommandProps {
  counselId: UniqueEntityId;
  message: string;
}
