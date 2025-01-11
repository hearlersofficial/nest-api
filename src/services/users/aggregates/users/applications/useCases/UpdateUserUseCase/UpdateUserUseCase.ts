import { UseCase } from "~shared/core/applications/UseCase";
import { UpdateUserUseCaseRequest } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/dto/UpdateUserUseCase.request";
import { UpdateUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/UpdateUserUseCase/dto/UpdateUserUseCase.response";
import { USER_REPOSITORY, UsersRepositoryPort } from "~users/aggregates/users/infrastructures/users.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserUseCaseRequest, UpdateUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  async execute(request?: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const { toUpdateUser } = request;

    // 업데이트 유저 저장
    const savedUser = await this.usersRepository.update(toUpdateUser);
    return {
      ok: true,
      user: savedUser,
    };
  }
}
