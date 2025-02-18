import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { CounselTechniquesRepositoryPort } from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PsqlCounselTechniquesRepositoryAdaptor implements CounselTechniquesRepositoryPort {
  constructor(
    @InjectRepository(CounselTechniquesEntity)
    private readonly counselTechniquesRepository: Repository<CounselTechniquesEntity>,
  ) {}
}
