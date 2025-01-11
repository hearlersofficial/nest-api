import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";

export interface UpdateAuthUserUseCaseRequest {
  toUpdateAuthUser: AuthUsers;
}
