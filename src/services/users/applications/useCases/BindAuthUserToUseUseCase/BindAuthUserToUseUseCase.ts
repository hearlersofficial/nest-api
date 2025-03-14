import { UseCase } from "~shared/core/applications/UseCase";
import { BindAuthUserToUseUseCaseRequest } from "~users/applications/useCases/BindAuthUserToUseUseCase/dto/BindAuthUserToUseUseCase.request";
import { BindAuthUserToUseUseCaseResponse } from "~users/applications/useCases/BindAuthUserToUseUseCase/dto/BindAuthUserToUseUseCase.response";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";

import { Injectable } from "@nestjs/common";

@Injectable()
export class BindAuthUserToUseUseCase
  implements UseCase<BindAuthUserToUseUseCaseRequest, BindAuthUserToUseUseCaseResponse>
{
  constructor(private readonly authUsersService: AuthUsersService) {}

  async execute(request: BindAuthUserToUseUseCaseRequest): Promise<BindAuthUserToUseUseCaseResponse> {
    const { user, authUser } = request;
    authUser.bindUser(user.id);
    await this.authUsersService.update(authUser);
    return { ok: true, authUser };
  }
}
