import { CreatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/CreatePersona/CreatePersona.command";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreatePersonaCommand)
export class CreatePersonaHandler implements ICommandHandler<CreatePersonaCommand> {
  constructor(private readonly personaService: PersonaService) {}

  async execute(command: CreatePersonaCommand): Promise<Personas> {
    const { body, counselorId } = command.props;
    const persona: Personas = await this.personaService.create({ body, counselorId });
    return persona;
  }
}
