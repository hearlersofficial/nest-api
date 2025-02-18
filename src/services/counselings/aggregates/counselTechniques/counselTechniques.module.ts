import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { PsqlCounselTechniquesRepositoryAdaptor } from "~counselings/aggregates/counselTechniques/infrastructures/adaptors/psql.counselTechniques.repository.adaptor";
import { COUNSEL_TECHNIQUE_REPOSITORY } from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselTechniquesEntity])],
  providers: [
    {
      provide: COUNSEL_TECHNIQUE_REPOSITORY,
      useClass: PsqlCounselTechniquesRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class CounselTechniquesModule {}
