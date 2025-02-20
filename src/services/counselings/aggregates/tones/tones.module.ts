import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { TonePersistor } from "~counselings/aggregates/tones/applications/tools/tone.persistor";
import { ToneReader } from "~counselings/aggregates/tones/applications/tools/tone.reader";
import { PsqlTonesRepositoryAdaptor } from "~counselings/aggregates/tones/infrastructures/adaptors/psql.tones.repository.adaptor";
import { TONE_REPOSITORY } from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([ToneEntity])],
  providers: [
    ToneService,
    ToneReader,
    TonePersistor,
    {
      provide: TONE_REPOSITORY,
      useClass: PsqlTonesRepositoryAdaptor,
    },
  ],
  exports: [ToneService],
})
export class TonesModule {}
