import { CounselTechniquesPersister } from "~counselings/domains/counselTechniques/counselTechniques.persister";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { PsqlCounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/psql-counselTechniques.repository";
import { RepositoryCounselTechniquesPersister } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.persister";
import { RepositoryCounselTechniquesReader } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CounselTechniquesEntity])],
  providers: [
    CounselTechniquesService,
    {
      provide: CounselTechniquesRepository,
      useClass: PsqlCounselTechniquesRepository,
    },
    {
      provide: CounselTechniquesReader,
      useClass: RepositoryCounselTechniquesReader,
    },
    {
      provide: CounselTechniquesPersister,
      useClass: RepositoryCounselTechniquesPersister,
    },
  ],
  exports: [CounselTechniquesService],
})
export class CounselTechniquesModule {}
