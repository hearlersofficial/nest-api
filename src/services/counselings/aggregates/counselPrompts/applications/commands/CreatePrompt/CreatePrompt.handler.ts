import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { VersionString } from "~shared/types/version.type";
import { CreatePromptCommand } from "~counselings/aggregates/counselPrompts/applications/commands/CreatePrompt/CreatePrompt.command";
import { CreateCounselPromptUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/CreateCounselPromptUseCase/CreateCounselPromptUseCase";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreatePromptCommand)
export class CreatePromptHandler implements ICommandHandler<CreatePromptCommand> {
  constructor(private readonly createCounselPromptUseCase: CreateCounselPromptUseCase) {}

  async execute(command: CreatePromptCommand): Promise<CounselPrompts> {
    const { props } = command;
    const request = {
      ...props,
      version: props.version as VersionString,
    };

    const createCounselPromptResult = await this.createCounselPromptUseCase.execute(request);
    if (!createCounselPromptResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, createCounselPromptResult.error);
    }

    return createCounselPromptResult.counselPrompt;
  }
}
