import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniquesStore } from "~counselings/domains/counselTechniques/counselTechniques.store";
import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counselTechniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { PsqlCounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/psql-counselTechniques.repository";
import { RepositoryCounselTechniquesReader } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.reader";
import { RepositoryCounselTechniquesStore } from "~counselings/domains/counselTechniques/infrastructures/repository-counselTechniques.store";
import { TypeormCounselTechniqueTransitionRulesRepository } from "~counselings/domains/counselTechniques/infrastructures/typeorm-counsel-technique-transition-rules.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CounselTechniquesEntity, CounselTechniqueTransitionRuleEntity])],
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
    {
      provide: CounselTechniqueTransitionRulesRepository,
      useClass: TypeormCounselTechniqueTransitionRulesRepository,
    },
  ],
  exports: [CounselTechniquesService],
})
export class CounselTechniquesModule {}
