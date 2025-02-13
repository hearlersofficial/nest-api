import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { HttpStatus } from "@nestjs/common";
<<<<<<< HEAD
=======
import { AuthUsers } from "~/src/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

export class ConnectAuthChannelCommand {
  constructor(public readonly props: ConnectAuthChannelCommandProps) {
    this.validate(props);
  }

  private validate(props: ConnectAuthChannelCommandProps): void {
    if (props.authChannel === AuthChannel.UNSPECIFIED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "인증 채널은 UNSPECIFIED일 수 없습니다.");
    }
    if (props.authChannel === AuthChannel.UNLINKED) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "인증 채널은 UNLINKED일 수 없습니다.");
    }
    if (props.uniqueId.length === 0) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "유니크 ID는 빈 문자열일 수 없습니다.");
    }
  }
}

interface ConnectAuthChannelCommandProps {
  userId: UniqueEntityId;
  authChannel: AuthChannel;
  uniqueId: string;
}

export class ConnectAuthChannelCommandResponse {
  authUser: AuthUsers;
}
