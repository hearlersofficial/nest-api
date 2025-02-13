<<<<<<< HEAD:src/services/users/aggregates/authUsers/infrastructures/authUsers.repository.port.ts
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";
=======
import { AuthUsers } from "~/src/aggregates/authUsers/domain/AuthUsers";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/authUsers/infrastructures/authUsers.repository.port.ts

export const AUTH_USERS_REPOSITORY = Symbol("AUTH_USERS_REPOSITORY");

export interface AuthUsersRepositoryPort {
  findOne(props: FindOnePropsInAuthUsersRepository): Promise<AuthUsers | null>;
  create(authUsers: AuthUsers): Promise<AuthUsers>;
  update(authUsers: AuthUsers): Promise<AuthUsers>;
}

export interface FindOnePropsInAuthUsersRepository {
  userId?: UniqueEntityId;
  authUserId?: UniqueEntityId;
  channelInfo?: {
    uniqueId?: string;
    authChannel?: AuthChannel;
  };
}
