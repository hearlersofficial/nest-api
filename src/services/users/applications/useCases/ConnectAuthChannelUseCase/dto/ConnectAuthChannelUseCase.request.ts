import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";

export interface ConnectAuthChannelUseCaseRequest {
  userId: number;
  channelInfo: {
    uniqueId: string;
    authChannel: AuthChannel;
  };
}
