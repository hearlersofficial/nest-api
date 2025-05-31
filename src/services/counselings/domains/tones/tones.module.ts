import { PsqlTonesRepository } from "~counselings/domains/tones/infrastructures/psql-tones.repository";
import { RepositoryTonesPersister } from "~counselings/domains/tones/infrastructures/repository-tones.persister";
import { RepositoryTonesReader } from "~counselings/domains/tones/infrastructures/repository-tones.reader";
import { TonesRepository } from "~counselings/domains/tones/infrastructures/tones.repository";
import { TonesPersister } from "~counselings/domains/tones/tones.persister";
import { TonesReader } from "~counselings/domains/tones/tones.reader";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";

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
