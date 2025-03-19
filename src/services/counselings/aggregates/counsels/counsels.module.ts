import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { FindCounselByIdHandler } from "~counselings/aggregates/counsels/applications/queries/FindCounselById/FindCounselById.handler";
import { FindCounselsHandler } from "~counselings/aggregates/counsels/applications/queries/FindCounsels/FindCounsels.handler";
import { CounselPersister } from "~counselings/aggregates/counsels/applications/tools/counsel.persister";
import { CounselReader } from "~counselings/aggregates/counsels/applications/tools/counsel.reader";
import { PsqlCounselsRepositoryAdaptor } from "~counselings/aggregates/counsels/infrastructures/adaptors/psql.counsels.repository.adaptor";
import { COUNSEL_REPOSITORY } from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselsEntity])],
  providers: [
    CounselPersister,
    CounselReader,
    CounselService,
    FindCounselByIdHandler,
    FindCounselsHandler,
    {
      provide: COUNSEL_REPOSITORY,
      useClass: PsqlCounselsRepositoryAdaptor,
    },
  ],
  exports: [CounselService],
})
export class CounselsModule {}
