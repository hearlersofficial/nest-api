import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { FindCounselTechniquesQuery } from "~counselings/aggregates/counselTechniques/applications/queries/FindCounselTechniques/FindCounselTechniques.query";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselTechniquesQuery)
export class FindCounselTechniquesHandler implements IQueryHandler<FindCounselTechniquesQuery> {
  constructor(private readonly counselTechniqueService: CounselTechniqueService) {}

  async execute(query: FindCounselTechniquesQuery): Promise<CounselTechniques[]> {
    const techniques = await this.counselTechniqueService.findMany(query.props);
    return techniques;
  }
}
