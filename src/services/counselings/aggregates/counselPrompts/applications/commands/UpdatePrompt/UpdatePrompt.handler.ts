import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { VersionString } from "~shared/types/version.type";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { UpdatePromptCommand } from "~counselings/aggregates/counselPrompts/applications/commands/UpdatePrompt/UpdatePrompt.command";
import { GetCounselPromptByIdUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByIdUseCase/GetCounselPromptByIdUseCase";
import { UpdateCounselPromptUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/UpdateCounselPromptUseCase/UpdateCounselPromptUseCase";
import { CounselPrompts, CounselPromptsProps } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

import { HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdatePromptCommand)
export class UpdatePromptHandler implements ICommandHandler<UpdatePromptCommand> {
  constructor(
    private readonly getCounselPromptByIdUseCase: GetCounselPromptByIdUseCase,
    private readonly updateCounselPromptUseCase: UpdateCounselPromptUseCase,
  ) {}

  async execute(command: UpdatePromptCommand): Promise<CounselPrompts> {
    const { promptId } = command.props;

    const getCounselPromptByIdResult = await this.getCounselPromptByIdUseCase.execute({ counselPromptId: promptId });
    if (!getCounselPromptByIdResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, getCounselPromptByIdResult.error);
    }
    const originPrompt = getCounselPromptByIdResult.counselPrompt;

    const updateProps = this.getUpdateProps(command, originPrompt);
    const toUpdatePromptOrError = CounselPrompts.create(updateProps, originPrompt.id);
    if (toUpdatePromptOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, toUpdatePromptOrError.error);
    }
    const toUpdatePrompt = toUpdatePromptOrError.value;

    const updateCounselPromptResult = await this.updateCounselPromptUseCase.execute({
      toUpdateCounselPrompt: toUpdatePrompt,
    });
    if (!updateCounselPromptResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, updateCounselPromptResult.error);
    }

    return updateCounselPromptResult.counselPrompt;
  }

  private getUpdateProps(command: UpdatePromptCommand, originPrompt: CounselPrompts): CounselPromptsProps {
    const { persona, context, instruction, tone, additionalPrompt, description, version } = command.props;
    const props = originPrompt.propsValue;
    if (persona !== null && persona !== undefined) props.persona = persona;
    if (context !== null && context !== undefined) props.context = context;
    if (instruction !== null && instruction !== undefined) props.instruction = instruction;
    if (tone !== null && tone !== undefined) props.tone = tone;
    if (additionalPrompt !== null && additionalPrompt !== undefined) props.additionalPrompt = additionalPrompt;
    if (description !== null && description !== undefined) props.description = description;
    if (version !== null && version !== undefined) props.version = version as VersionString;
    props.updatedAt = getNowDayjs();

    return props;
  }
}
