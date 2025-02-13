<<<<<<< HEAD:src/services/users/aggregates/users/infrastructures/users.repository.port.ts
import { Users } from "~users/aggregates/users/domain/Users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";
=======
import { Users } from "~/src/aggregates/users/domain/Users";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/infrastructures/users.repository.port.ts

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UsersRepositoryPort {
  findOne(props: FindOnePropsInUsersRepository): Promise<Users | null>;
  create(user: Users): Promise<Users>;
  update(user: Users): Promise<Users>;
}

export interface FindOnePropsInUsersRepository {
  userId?: UniqueEntityId;
  nickname?: string;
  authChannel?: AuthChannel;
  uniqueId?: string;
}
