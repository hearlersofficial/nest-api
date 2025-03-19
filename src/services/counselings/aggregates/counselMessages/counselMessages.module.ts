import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { ReactMessageHandler } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.handler";
import { CounselMessageService } from "~counselings/aggregates/counselMessages/applications/counselMessage.service";
import { FindMessagesHandler } from "~counselings/aggregates/counselMessages/applications/queries/FindMessages/FindMessages.handler";
import { CounselMessagePersister } from "~counselings/aggregates/counselMessages/applications/tools/counselMessage.persister";
import { CounselMessageReader } from "~counselings/aggregates/counselMessages/applications/tools/counselMessage.reader";
import { PsqlCounselMessagesRepositoryAdaptor } from "~counselings/aggregates/counselMessages/infrastructures/adaptors/psql.counselMessages.repository.adaptor";
import { COUNSEL_MESSAGE_REPOSITORY } from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselMessagesEntity])],
  providers: [
    CounselMessagePersister,
    CounselMessageReader,
    CounselMessageService,
    ReactMessageHandler,
    FindMessagesHandler,
    {
      provide: COUNSEL_MESSAGE_REPOSITORY,
      useClass: PsqlCounselMessagesRepositoryAdaptor,
    },
  ],
  exports: [CounselMessageService],
})
export class CounselMessagesModule {}
