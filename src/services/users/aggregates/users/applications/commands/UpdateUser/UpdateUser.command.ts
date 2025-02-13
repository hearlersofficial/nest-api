import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD:src/services/users/aggregates/users/applications/commands/UpdateUser/UpdateUser.command.ts
=======
import { Gender, Mbti } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/applications/commands/UpdateUser/UpdateUser.command.ts

export class UpdateUserCommand {
  constructor(public readonly props: UpdateUserCommandProps) {
    this.validate(props);
  }

  private validate(props: UpdateUserCommandProps): void {
    if (props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "userId는 필수입니다.");
    }
  }
}

interface UpdateUserCommandProps {
  userId: UniqueEntityId;
  nickname?: string;
  profileImage?: string;
  phoneNumber?: string;
  gender?: Gender;
  birthday?: string;
  introduction?: string;
  mbti?: Mbti;
}
