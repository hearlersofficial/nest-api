import { Inject, Injectable } from "@nestjs/common";

import { FindOneAuthUserUseCaseRequest } from "./dto/FindOneAuthUserUseCase.request";
import { FindOneAuthUserUseCaseResponse } from "./dto/FindOneAuthUserUseCase.response";
import {
  AUTH_USERS_REPOSITORY,
  AuthUsersRepositoryPort,
  FindOnePropsInAuthUsersRepository,
} from "~users/aggregates/authUsers/infrastructures/authUsers.repository.port";
import { UseCase } from "~shared/core/applications/UseCase";

@Injectable()
export class FindOneAuthUserUseCase implements UseCase<FindOneAuthUserUseCaseRequest, FindOneAuthUserUseCaseResponse> {
  constructor(@Inject(AUTH_USERS_REPOSITORY) private readonly authUsersRepository: AuthUsersRepositoryPort) {}

  async execute(request: FindOneAuthUserUseCaseRequest): Promise<FindOneAuthUserUseCaseResponse> {
    const { userId, authUserId, channelInfo } = request;
    if (userId === undefined && authUserId === undefined && channelInfo === undefined) {
      return { ok: false, error: "userId, authUserId, channelInfo 중 하나는 필수입니다." };
    }
    const repoRequest: FindOnePropsInAuthUsersRepository = {};
    if (userId !== undefined) repoRequest.userId = userId;
    if (authUserId !== undefined) repoRequest.authUserId = authUserId;
    if (channelInfo !== undefined) repoRequest.channelInfo = channelInfo;

    const authUser = await this.authUsersRepository.findOne(repoRequest);
    return { ok: true, authUser };
  }
}
