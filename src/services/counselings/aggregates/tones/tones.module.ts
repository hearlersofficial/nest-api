import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { PsqlTonesRepositoryAdaptor } from "~counselings/aggregates/tones/infrastructures/adaptors/psql.tones.repository.adaptor";
import { TONES_REPOSITORY } from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ToneEntity])],
  providers: [
    {
      provide: TONES_REPOSITORY,
      useClass: PsqlTonesRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class TonesModule {}
