import { ToneEntity } from "~shared/core/infrastructure/entities/counselors/Tones.entity";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";
import { TonesReader } from "~counselings/domains/tones/tones.reader";
import { TonesService } from "~counselings/domains/tones/tones.service";
import { PsqlTonesRepository } from "~counselings/infrastructures/tones/psql-tones.repository";
import { RepositoryTonesPersister } from "~counselings/infrastructures/tones/repository-tones.persister";
import { RepositoryTonesReader } from "~counselings/infrastructures/tones/repository-tones.reader";
import { TonesRepository } from "~counselings/infrastructures/tones/tones.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ToneEntity])],
  providers: [
    TonesService,
    {
      provide: TonesRepository,
      useClass: PsqlTonesRepository,
    },
    {
      provide: TonesReader,
      useClass: RepositoryTonesReader,
    },
    {
      provide: TonesPersister,
      useClass: RepositoryTonesPersister,
    },
  ],
  exports: [TonesService],
})
export class TonesModule {}
