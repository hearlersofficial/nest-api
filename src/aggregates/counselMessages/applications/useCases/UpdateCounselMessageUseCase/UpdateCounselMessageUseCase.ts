import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { UpdateCounselMessageUseCaseRequest } from "./dto/UpdateCounselMessage.request";
import { UpdateCounselMessageUseCaseResponse } from "./dto/UpdateCounselMessage.response";
import { COUNSEL_MESSAGE_REPOSITORY, CounselMessagesRepositoryPort } from "../../../infrastructures/counselMessages.repository.port";

@Injectable()
export class UpdateCounselMessageUseCase implements UseCase<UpdateCounselMessageUseCaseRequest, UpdateCounselMessageUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request?: UpdateCounselMessageUseCaseRequest): Promise<UpdateCounselMessageUseCaseResponse> {
    const { toUpdateCounselMessage } = request;

    const savedCounselMessage = await this.counselMessagesRepository.update(toUpdateCounselMessage);
    return {
      ok: true,
      counselMessage: savedCounselMessage,
    };
  }
}
