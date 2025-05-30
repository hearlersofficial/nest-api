import {
  BindAuthUserToUseUseCaseRequest,
  BindAuthUserToUseUseCaseResponse,
} from "~users/applications/use-cases/dtos/bind-user-to-auth-user.dto";
import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";

import { Injectable } from "@nestjs/common";
import { UseCase } from "~common/shared-kernel/interfaces/UseCase";

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
