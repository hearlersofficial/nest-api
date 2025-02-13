import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateAuthUserUseCaseResponse } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/dto/UpdateAuthUserUseCase.response";
import { UpdateAuthUserUseCase } from "~users/aggregates/authUsers/applications/useCases/UpdateAuthUserUseCase/UpdateAuthUserUseCase";
import { BindAuthUserToUseUseCaseRequest } from "~users/applications/useCases/BindAuthUserToUseUseCase/dto/BindAuthUserToUseUseCase.request";
import { BindAuthUserToUseUseCaseResponse } from "~users/applications/useCases/BindAuthUserToUseUseCase/dto/BindAuthUserToUseUseCase.response";

import { Injectable } from "@nestjs/common";

@Injectable()
export class BindAuthUserToUseUseCase
  implements UseCase<BindAuthUserToUseUseCaseRequest, BindAuthUserToUseUseCaseResponse>
{
  constructor(private readonly updateAuthUserUseCase: UpdateAuthUserUseCase) {}

  async execute(request: BindAuthUserToUseUseCaseRequest): Promise<BindAuthUserToUseUseCaseResponse> {
    const { user, authUser } = request;
    authUser.bindUser(user.id);
    const updateAuthUserResponse: UpdateAuthUserUseCaseResponse = await this.updateAuthUserUseCase.execute({
      toUpdateAuthUser: authUser,
    });
    if (!updateAuthUserResponse.ok) {
      return { ok: false, error: updateAuthUserResponse.error };
    }
    return { ok: true, user, authUser };
  }
}
