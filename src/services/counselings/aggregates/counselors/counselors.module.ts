import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";
import { CreateCounselorHandler } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.handler";
import { UpdateCounselorHandler } from "~counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.handler";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { FindCounselorByIdHandler } from "~counselings/aggregates/counselors/applications/queries/FindCounselorById/FindCounselorById.handler";
import { FindCounselorsHandler } from "~counselings/aggregates/counselors/applications/queries/FindCounselors/FindCounselors.handler";
import { CounselorPersister } from "~counselings/aggregates/counselors/applications/tools/counselor.persister";
import { CounselorReader } from "~counselings/aggregates/counselors/applications/tools/counselor.reader";
import { PsqlCounselorsRepositoryAdaptor } from "~counselings/aggregates/counselors/infrastructures/adaptors/psql.counselors.repository.adaptor";
import { COUNSELOR_REPOSITORY } from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselorsEntity])],
  providers: [
    CounselorPersister,
    CounselorReader,
    CounselorService,
    CreateCounselorHandler,
    UpdateCounselorHandler,
    FindCounselorByIdHandler,
    FindCounselorsHandler,
    {
      provide: COUNSELOR_REPOSITORY,
      useClass: PsqlCounselorsRepositoryAdaptor,
    },
  ],
  exports: [CounselorService],
})
export class CounselorsModule {}
