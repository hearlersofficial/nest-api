import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { GetCounselListHandler } from "~counselings/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.handler";
import { CreateCounselUseCase } from "~counselings/aggregates/counsels/applications/useCases/CreateCounselUseCase/CreateCounselUseCase";
import { GetCounselListUseCase } from "~counselings/aggregates/counsels/applications/useCases/GetCounselListUseCase/GetCounselListUseCase";
import { GetCounselUseCase } from "~counselings/aggregates/counsels/applications/useCases/GetCounselUseCase/GetCounselUseCase";
import { UpdateCounselUseCase } from "~counselings/aggregates/counsels/applications/useCases/UpdateCounselUseCase/UpdateCounselUseCase";
import { PsqlCounselsRepositoryAdaptor } from "~counselings/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor";
import { COUNSEL_REPOSITORY } from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [CreateCounselUseCase, GetCounselListUseCase, GetCounselUseCase, UpdateCounselUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([CounselsEntity])],
  providers: [
    ...useCases,
    GetCounselListHandler,
    {
      provide: COUNSEL_REPOSITORY,
      useClass: PsqlCounselsRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class CounselsModule {}
