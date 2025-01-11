import { Users } from "~users/aggregates/users/domain/Users";
import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface UpdateUserUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
}
