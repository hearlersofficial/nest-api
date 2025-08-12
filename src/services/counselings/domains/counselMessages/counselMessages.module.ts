import { CounselMessagesPersister } from "~counselings/domains/counselMessages/counselMessages.persister";
import { CounselMessagesReader } from "~counselings/domains/counselMessages/counselMessages.reader";
import { CounselMessagesService } from "~counselings/domains/counselMessages/counselMessages.service";
import { CounselMessagesRepository } from "~counselings/domains/counselMessages/infrastructures/counselMessages.repository";
import { PsqlCounselMessagesRepository } from "~counselings/domains/counselMessages/infrastructures/psql-counselMessages.repository";
import { RepositoryCounselMessagesPersister } from "~counselings/domains/counselMessages/infrastructures/repository-counselMessages.persister";
import { RepositoryCounselMessagesReader } from "~counselings/domains/counselMessages/infrastructures/repository-counselMessages.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/CounselMessages.entity";

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
