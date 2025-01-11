import { UseCaseCoreResponse } from "~shared/core/applications/UseCase.response";
import { AuthUsers } from "~users/aggregates/authUsers/domain/AuthUsers";

export interface FindOneAuthUserUseCaseResponse extends UseCaseCoreResponse {
  authUser?: AuthUsers | null;
}
