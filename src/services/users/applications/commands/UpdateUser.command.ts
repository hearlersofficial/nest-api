import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { HttpStatus } from "@nestjs/common";

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
