import { Inject, Injectable } from "@nestjs/common";
import { CreateUserUseCaseRequest } from "./dto/CreateUser.request";
import { CreateUserUseCaseResponse } from "./dto/CreateUser.response";
import { UserProgresses } from "~/src/aggregates/users/domain/UserProgresses";
import { Users } from "~/src/aggregates/users/domain/Users";
import { USER_REPOSITORY, UsersRepositoryPort } from "~/src/aggregates/users/infrastructures/users.repository.port";
import { ProgressStatus, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { Result } from "~/src/shared/core/domain/Result";

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
