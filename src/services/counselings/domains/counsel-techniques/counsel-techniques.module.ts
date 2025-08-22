import { CounselTechniquesReader } from "~counselings/domains/counsel-techniques/counsel-techniques.reader";
import { CounselTechniquesService } from "~counselings/domains/counsel-techniques/counsel-techniques.service";
import { CounselTechniquesStore } from "~counselings/domains/counsel-techniques/counsel-techniques.store";
import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counselTechniques.repository";
import { RepositoryCounselTechniquesReader } from "~counselings/domains/counsel-techniques/infrastructures/repository-counsel-techniques.reader";
import { RepositoryCounselTechniquesStore } from "~counselings/domains/counsel-techniques/infrastructures/repository-counsel-techniques.store";
import { TypeormCounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/typeorm-counsel-technique-transition-rules.repository";
import { TypeormCounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/typeorm-counselTechniques.repository";

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
      useClass: TypeormCounselTechniquesRepository,
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
