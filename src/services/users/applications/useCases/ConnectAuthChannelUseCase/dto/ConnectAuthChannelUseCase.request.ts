<<<<<<< HEAD
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";
=======
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

export interface ConnectAuthChannelUseCaseRequest {
  userId: UniqueEntityId;
  channelInfo: {
    uniqueId: string;
    authChannel: AuthChannel;
  };
}
