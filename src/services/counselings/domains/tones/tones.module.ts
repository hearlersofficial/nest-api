import { PsqlTonesRepository } from "~counselings/domains/tones/infrastructures/psql-tones.repository";
import { RepositoryTonesReader } from "~counselings/domains/tones/infrastructures/repository-tones.reader";
import { RepositoryTonesStore } from "~counselings/domains/tones/infrastructures/repository-tones.store";
import { TonesRepository } from "~counselings/domains/tones/infrastructures/tones.repository";
import { TonesReader } from "~counselings/domains/tones/tones.reader";
import { TonesService } from "~counselings/domains/tones/tones.service";
import { TonesStore } from "~counselings/domains/tones/tones.store";

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
      provide: TonesStore,
      useClass: RepositoryTonesStore,
    },
  ],
  exports: [TonesService],
})
export class TonesModule {}
