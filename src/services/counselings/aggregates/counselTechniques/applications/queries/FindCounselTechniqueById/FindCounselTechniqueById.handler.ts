import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { FindCounselTechniqueByIdQuery } from "~counselings/aggregates/counselTechniques/applications/queries/FindCounselTechniqueById/FindCounselTechniqueById.query";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselTechniqueByIdQuery)
export class FindCounselTechniqueByIdHandler implements IQueryHandler<FindCounselTechniqueByIdQuery> {
  constructor(private readonly counselTechniqueService: CounselTechniqueService) {}

  async execute(query: FindCounselTechniqueByIdQuery): Promise<CounselTechniques> {
    const technique = await this.counselTechniqueService.getById(query.techniqueId);
    return technique;
  }
}
