import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniquesStore } from "~counselings/domains/counselTechniques/counselTechniques.store";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { PsqlCounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/psql-counselTechniques.repository";
import { RepositoryCounselTechniquesReader } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.reader";
import { RepositoryCounselTechniquesStore } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.store";

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
      provide: CounselTechniquesStore,
      useClass: RepositoryCounselTechniquesStore,
    },
  ],
  exports: [CounselTechniquesService],
})
export class CounselTechniquesModule {}
