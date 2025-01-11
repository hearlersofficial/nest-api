import { Inject, Injectable } from "@nestjs/common";
import { FindOneUserUseCaseRequest } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/dto/FindOneUserUseCase.request";
import { FindOneUserUseCaseResponse } from "~users/aggregates/users/applications/useCases/FindOneUserUseCase/dto/FindOneUserUseCase.response";
import { Users } from "~users/aggregates/users/domain/Users";
import { USER_REPOSITORY, UsersRepositoryPort } from "~users/aggregates/users/infrastructures/users.repository.port";
import { UseCase } from "~shared/core/applications/UseCase";
import { AuthChannel } from "~proto/com/hearlers/v1/model/auth_user_pb";

@Injectable()
export class FindOneUserUseCase implements UseCase<FindOneUserUseCaseRequest, FindOneUserUseCaseResponse> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UsersRepositoryPort,
  ) {}
  async execute(request: FindOneUserUseCaseRequest): Promise<FindOneUserUseCaseResponse> {
    const { userId, nickname, authChannel, uniqueId } = request;
    // 만약 유저아이디가 없거나 닉네임이 없거나, 혹은 NONE이 아닌 인증 채널과 유니크아이디가 없는 경우가 모두 해당되지 않는 경우
    if (!userId && !nickname && !(authChannel === AuthChannel.UNSPECIFIED || uniqueId)) {
      return {
        ok: false,
        error: "유니크한 유저를 식별가능한 최소한의 값이 주어지지 않았습니다.",
      };
    }
    const user: Users = await this.usersRepository.findOne({ userId, nickname, authChannel, uniqueId });
    return {
      ok: true,
      user,
    };
  }
}
