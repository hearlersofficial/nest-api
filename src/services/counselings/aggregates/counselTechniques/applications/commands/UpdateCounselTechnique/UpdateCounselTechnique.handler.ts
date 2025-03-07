import { UpdateCounselTechniqueCommand } from "~counselings/aggregates/counselTechniques/applications/commands/UpdateCounselTechnique/UpdateCounselTechnique.command";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

@CommandHandler(UpdateCounselTechniqueCommand)
export class UpdateCounselTechniqueHandler implements ICommandHandler<UpdateCounselTechniqueCommand> {
  constructor(private readonly counselTechniqueService: CounselTechniqueService) {}

  async execute(command: UpdateCounselTechniqueCommand): Promise<CounselTechniques> {
    const { techniqueId, name, toneId, contextId, instructionId, counselTechniqueStage } = command.props;
    const technique: CounselTechniques = await this.counselTechniqueService.getById(techniqueId);
    technique.update({ name, toneId, contextId, instructionId, counselTechniqueStage });
    await this.counselTechniqueService.update(technique);
    return technique;
  }
}
