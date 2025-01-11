import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

export const AUTH_USERS_REPOSITORY = Symbol("AUTH_USERS_REPOSITORY");

export interface AuthUsersRepositoryPort {
  findOne(props: FindOnePropsInAuthUsersRepository): Promise<AuthUsers | null>;
  create(authUsers: AuthUsers): Promise<AuthUsers>;
  update(authUsers: AuthUsers): Promise<AuthUsers>;
}

export interface FindOnePropsInAuthUsersRepository {
  userId?: number;
  authUserId?: number;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
