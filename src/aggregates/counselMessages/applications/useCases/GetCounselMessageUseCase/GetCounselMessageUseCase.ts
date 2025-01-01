import { Inject, Injectable } from "@nestjs/common";
import { UseCase } from "~/src/shared/core/applications/UseCase";
import { GetCounselMessageUseCaseRequest } from "./dto/GetCounselMessage.request";
import { GetCounselMessageUseCaseResponse } from "./dto/GetCounselMessage.response";
import { COUNSEL_MESSAGE_REPOSITORY, CounselMessagesRepositoryPort } from "../../../infrastructures/counselMessages.repository.port";

@Injectable()
export class GetCounselMessageUseCase implements UseCase<GetCounselMessageUseCaseRequest, GetCounselMessageUseCaseResponse> {
  constructor(
    @Inject(COUNSEL_MESSAGE_REPOSITORY)
    private readonly counselMessagesRepository: CounselMessagesRepositoryPort,
  ) {}

  async execute(request: GetCounselMessageUseCaseRequest): Promise<GetCounselMessageUseCaseResponse> {
    const { counselMessageId } = request;
    const counselMessage = await this.counselMessagesRepository.findOne({ counselMessageId });
    return {
      ok: true,
      counselMessage,
    };
  }
}
