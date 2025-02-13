import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query.ts

export class GetMessageListQuery {
  constructor(public readonly props: GetMessageListQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: GetMessageListQueryProps): void {
    if (props.counselId === null || props.counselId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담 ID는 필수입니다.");
    }
  }
}

interface GetMessageListQueryProps {
  counselId: UniqueEntityId;
}
