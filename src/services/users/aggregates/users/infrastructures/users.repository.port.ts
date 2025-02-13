import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Users } from "~users/aggregates/users/domain/Users";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

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
