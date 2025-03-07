import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { CreateCounselTechniqueHandler } from "~counselings/aggregates/counselTechniques/applications/commands/CreateCounselTechnique/CreateCounselTechnique.handler";
import { UpdateCounselTechniqueHandler } from "~counselings/aggregates/counselTechniques/applications/commands/UpdateCounselTechnique/UpdateCounselTechnique.handler";
import { CounselTechniqueService } from "~counselings/aggregates/counselTechniques/applications/counselTechnique.service";
import { FindCounselTechniqueByIdHandler } from "~counselings/aggregates/counselTechniques/applications/queries/FindCounselTechniqueById/FindCounselTechniqueById.handler";
import { FindCounselTechniquesHandler } from "~counselings/aggregates/counselTechniques/applications/queries/FindCounselTechniques/FindCounselTechniques.handler";
import { CounselTechniquePersistor } from "~counselings/aggregates/counselTechniques/applications/tools/counselTechnique.persistor";
import { CounselTechniqueReader } from "~counselings/aggregates/counselTechniques/applications/tools/counselTechnique.reader";
import { PsqlCounselTechniquesRepositoryAdaptor } from "~counselings/aggregates/counselTechniques/infrastructures/adaptors/psql.counselTechniques.repository.adaptor";
import { COUNSEL_TECHNIQUE_REPOSITORY } from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselTechniquesEntity])],
  providers: [
    CounselTechniquePersistor,
    CounselTechniqueReader,
    CounselTechniqueService,
    CreateCounselTechniqueHandler,
    UpdateCounselTechniqueHandler,
    FindCounselTechniqueByIdHandler,
    FindCounselTechniquesHandler,
    {
      provide: COUNSEL_TECHNIQUE_REPOSITORY,
      useClass: PsqlCounselTechniquesRepositoryAdaptor,
    },
  ],
  exports: [CounselTechniqueService],
})
export class CounselTechniquesModule {}
