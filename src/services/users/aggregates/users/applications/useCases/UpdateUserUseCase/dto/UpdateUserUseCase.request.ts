import { Users } from "~users/aggregates/users/domain/Users";

export interface UpdateUserUseCaseRequest {
  toUpdateUser: Users;
}
