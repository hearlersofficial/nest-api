import { UpdatePersonaCommand } from "~counselings/aggregates/personas/applications/commands/UpdatePersona/UpdatePersona.command";
import { PersonaService } from "~counselings/aggregates/personas/applications/persona.service";
import { Personas } from "~counselings/aggregates/personas/domain/personas";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdatePersonaCommand)
export class UpdatePersonaHandler implements ICommandHandler<UpdatePersonaCommand> {
  constructor(private readonly personaService: PersonaService) {}

  async execute(command: UpdatePersonaCommand): Promise<Personas> {
    const { personaId, body } = command.props;
    const persona: Personas = await this.personaService.getById(personaId);
    persona.update({ body });
    await this.personaService.update(persona);
    return persona;
  }
}
