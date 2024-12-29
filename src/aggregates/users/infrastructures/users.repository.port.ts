import { Users } from "~/src/aggregates/users/domain/Users";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");

export interface UsersRepositoryPort {
  findOne(props: FindOnePropsInUsersRepository): Promise<Users | null>;
  create(user: Users): Promise<Users>;
  update(user: Users): Promise<Users>;
}

export interface FindOnePropsInUsersRepository {
  userId?: number;
  nickname?: string;
  authChannel?: AuthChannel;
  uniqueId?: string;
}
