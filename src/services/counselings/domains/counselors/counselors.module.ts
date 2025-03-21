import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { PersonaEntity } from "~shared/core/infrastructure/entities/counselors/Personas.entity";
import { CounselorsPersister } from "~counselings/domains/counselors/counselors.persister";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselorsRepository } from "~counselings/infrastructures/counselors.repository";
import { PsqlCounselorsRepository } from "~counselings/infrastructures/psql-counselors.repository";
import { RepositoryCounselorsPersister } from "~counselings/infrastructures/repository-counselors.persister";
import { RepositoryCounselorsReader } from "~counselings/infrastructures/repository-counselors.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselorsEntity, PersonaEntity])],
  providers: [
    CounselorsService,
    {
      provide: CounselorsRepository,
      useClass: PsqlCounselorsRepository,
    },
    {
      provide: CounselorsReader,
      useClass: RepositoryCounselorsReader,
    },
    {
      provide: CounselorsPersister,
      useClass: RepositoryCounselorsPersister,
    },
  ],
  exports: [CounselorsService],
})
export class CounselorsModule {}
