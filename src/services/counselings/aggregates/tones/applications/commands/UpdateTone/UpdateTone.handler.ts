import { UpdateToneCommand } from "~counselings/aggregates/tones/applications/commands/UpdateTone/UpdateTone.command";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateToneCommand)
export class UpdateToneHandler implements ICommandHandler<UpdateToneCommand> {
  constructor(private readonly toneService: ToneService) {}

  async execute(command: UpdateToneCommand): Promise<Tones> {
    const { toneId, name, body } = command.props;
    const tone: Tones = await this.toneService.getById(toneId);
    tone.update({ name, body });
    await this.toneService.update(tone);
    return tone;
  }
}
