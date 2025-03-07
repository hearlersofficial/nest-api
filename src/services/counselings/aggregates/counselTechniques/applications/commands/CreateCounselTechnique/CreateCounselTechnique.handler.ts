import { CreateCounselTechniqueCommand } from "~counselings/aggregates/counselTechniques/applications/commands/CreateCounselTechnique/CreateCounselTechnique.command";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(CreateCounselTechniqueCommand)
export class CreateCounselTechniqueHandler implements ICommandHandler<CreateCounselTechniqueCommand> {
  constructor(private readonly counselTechniqueService: CounselTechniqueService) {}

  async execute(command: CreateCounselTechniqueCommand): Promise<CounselTechniques> {
    const { name, toneId, contextId, instructionId, counselTechniqueStage, nextTechniqueId } = command.props;
    const technique: CounselTechniques = await this.counselTechniqueService.create({
      name,
      toneId,
      contextId,
      instructionId,
      counselTechniqueStage,
      nextTechniqueId,
    });
    return technique;
  }
}
