import { CreateToneCommand } from "~counselings/aggregates/tones/applications/commands/CreateTone/CreateTone.command";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateToneCommand)
export class CreateToneHandler implements ICommandHandler<CreateToneCommand> {
  constructor(private readonly toneService: ToneService) {}

  async execute(command: CreateToneCommand): Promise<Tones> {
    const { name, body } = command.props;
    const tone: Tones = await this.toneService.create({ name, body });
    return tone;
  }
}
