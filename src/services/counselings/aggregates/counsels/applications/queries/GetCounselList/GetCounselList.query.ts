import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/counselings/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.query.ts
=======
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.query.ts

export class GetCounselListQuery {
  constructor(public readonly props: GetCounselListQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: GetCounselListQueryProps): void {
    if (props.userId === null || props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "사용자 ID는 필수입니다.");
    }
  }
}

interface GetCounselListQueryProps {
  userId: UniqueEntityId;
}
