import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/CounselMessages.entity";
import { ReactMessageHandler } from "~counselings/aggregates/counselMessages/applications/commands/ReactMessage/ReactMessage.handler";
import { GetMessageListHandler } from "~counselings/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.handler";
import { CreateCounselMessageUseCase } from "~counselings/aggregates/counselMessages/applications/useCases/CreateCounselMessageUseCase/CreateCounselMessageUseCase";
import { GetCounselMessageListUseCase } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageListUseCase/GetCounselMessageListUseCase";
import { GetCounselMessageUseCase } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageUseCase/GetCounselMessageUseCase";
import { UpdateCounselMessageUseCase } from "~counselings/aggregates/counselMessages/applications/useCases/UpdateCounselMessageUseCase/UpdateCounselMessageUseCase";
import { PsqlCounselMessagesRepositoryAdaptor } from "~counselings/aggregates/counselMessages/infrastructures/adaptors/psql.counselMessages.repository.adaptor";
import { COUNSEL_MESSAGE_REPOSITORY } from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [
  CreateCounselMessageUseCase,
  GetCounselMessageListUseCase,
  GetCounselMessageUseCase,
  UpdateCounselMessageUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([CounselMessagesEntity])],
  providers: [
    ...useCases,
    GetMessageListHandler,
    ReactMessageHandler,
    {
      provide: COUNSEL_MESSAGE_REPOSITORY,
      useClass: PsqlCounselMessagesRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class CounselMessagesModule {}
