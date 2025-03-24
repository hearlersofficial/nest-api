import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { CounselMessagesPersister } from "~counselings/domains/counselMessages/counselMessages.persister";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessagesRepository } from "~counselings/infrastructures/counselMessages/counselMessages.repository";
import { PsqlCounselMessagesRepository } from "~counselings/infrastructures/counselMessages/psql-counselMessages.repository";
import { RepositoryCounselMessagesPersister } from "~counselings/infrastructures/counselMessages/repository-counselMessages.persister";
import { RepositoryCounselMessagesReader } from "~counselings/infrastructures/counselMessages/repository-counselMessages.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselMessagesEntity])],
  providers: [
    CounselMessagesService,
    {
      provide: CounselMessagesRepository,
      useClass: PsqlCounselMessagesRepository,
    },
    {
      provide: CounselMessagesReader,
      useClass: RepositoryCounselMessagesReader,
    },
    {
      provide: CounselMessagesPersister,
      useClass: RepositoryCounselMessagesPersister,
    },
  ],
  exports: [CounselMessagesService],
})
export class CounselMessagesModule {}
