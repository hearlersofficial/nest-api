import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselMessagesEntity } from "~/src/shared/core/infrastructure/entities/CounselMessages.entity";
import { CreateCounselMessageUseCase } from "./applications/useCases/CreateCounselMessageUseCase/CreateCounselMessageUseCase";
import { GetCounselMessageListUseCase } from "./applications/useCases/GetCounselMessageListUseCase/GetCounselMessageListUseCase";
import { GetMessageListHandler } from "./applications/queries/GetMessageList/GetMessageList.handler";
import { COUNSEL_MESSAGE_REPOSITORY } from "./infrastructures/counselMessages.repository.port";
import { PsqlCounselMessagesRepositoryAdaptor } from "./infrastructures/adaptors/psql.counselMessages.repository.adaptor";
import { GetCounselMessageUseCase } from "./applications/useCases/GetCounselMessageUseCase/GetCounselMessageUseCase";
import { UpdateCounselMessageUseCase } from "./applications/useCases/UpdateCounselMessageUseCase/UpdateCounselMessageUseCase";
import { ReactMessageHandler } from "./applications/commands/ReactMessage/ReactMessage.handler";

const useCases = [CreateCounselMessageUseCase, GetCounselMessageListUseCase, GetCounselMessageUseCase, UpdateCounselMessageUseCase];

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
