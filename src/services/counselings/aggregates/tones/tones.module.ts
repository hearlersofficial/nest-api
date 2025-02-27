import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { CreateToneHandler } from "~counselings/aggregates/tones/applications/commands/CreateTone/CreateTone.handler";
import { UpdateToneHandler } from "~counselings/aggregates/tones/applications/commands/UpdateTone/UpdateTone.handler";
import { FindToneByIdHandler } from "~counselings/aggregates/tones/applications/queries/FindToneById/FindToneById.handler";
import { FindTonesHandler } from "~counselings/aggregates/tones/applications/queries/FindTones/FindTones.handler";
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
    CreateToneHandler,
    UpdateToneHandler,
    FindTonesHandler,
    FindToneByIdHandler,
    {
      provide: TONE_REPOSITORY,
      useClass: PsqlTonesRepositoryAdaptor,
    },
  ],
  exports: [ToneService],
})
export class TonesModule {}
