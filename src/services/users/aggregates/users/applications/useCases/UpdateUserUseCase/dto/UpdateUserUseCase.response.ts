import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { Users } from "~users/aggregates/users/domain/Users";

export interface UpdateUserUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
}
