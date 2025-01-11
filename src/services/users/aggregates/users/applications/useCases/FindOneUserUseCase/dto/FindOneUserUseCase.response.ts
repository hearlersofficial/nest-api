import { Users } from "~users/aggregates/users/domain/Users";
import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";

export interface FindOneUserUseCaseResponse extends UseCaseCoreResponse {
  user?: Users;
}
