import { UseCase } from "~shared/core/applications/UseCase";
import { Result } from "~shared/core/domain/Result";
import { CreateUserUseCaseRequest } from "~users/aggregates/users/applications/useCases/CreateUserUseCase/dto/CreateUser.request";
import { CreateUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/CreateUserUseCase/dto/CreateUser.response";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";
import { Users } from "~users/aggregates/users/domain/Users";
import { USER_REPOSITORY, UsersRepositoryPort } from "~users/aggregates/users/infrastructures/users.repository.port";
import { ProgressStatus, ProgressType } from "~proto/com/hearlers/v1/model/user_pb";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserUseCaseRequest, CreateUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}

  async execute(): Promise<CreateUserUseCaseResponse> {
    const userResult = Users.createNew({});
    if (userResult.isFailure) {
      return { ok: false, error: userResult.error };
    }
    const progressResult = this.createUserProgresses(userResult.value);
    if (progressResult.isFailure) {
      return { ok: false, error: progressResult.error };
    }
    const user = userResult.value;
    user.userMessageToken.updateMaxTokens(7);

    const savedUser = await this.usersRepository.create(userResult.value);
    return { ok: true, user: savedUser };
  }

  private createUserProgresses(user: Users): Result<void> {
    const progressTypes = [
      { type: ProgressType.ONBOARDING, status: ProgressStatus.NOT_STARTED },
      { type: ProgressType.VERIFICATION, status: ProgressStatus.NOT_STARTED },
    ];

    for (const { type, status } of progressTypes) {
      const progressResult = UserProgresses.createNew({
        userId: user.id,
        status,
        progressType: type,
      });

      if (progressResult.isFailure) {
        return Result.fail(progressResult.error);
      }

      const addedResult = user.addProgress(progressResult.value);
      if (addedResult.isFailure) {
        return Result.fail(addedResult.error);
      }
    }

    return Result.ok();
  }
}
