import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";
import { CreateCounselorHandler } from "~counselings/aggregates/counselors/applications/commands/CreateCounselor/CreateCounselor.handler";
import { UpdateCounselorHandler } from "~counselings/aggregates/counselors/applications/commands/UpdateCounselor/UpdateCounselor.handler";
import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { GetCounselorListHandler } from "~counselings/aggregates/counselors/applications/queries/GetCounselorList/GetCounselorList.handler";
import { CounselorPersister } from "~counselings/aggregates/counselors/applications/tools/counselor.persister";
import { CounselorReader } from "~counselings/aggregates/counselors/applications/tools/counselor.reader";
import { CreateCounselorUseCase } from "~counselings/aggregates/counselors/applications/useCases/CreateCounselorUseCase/CreateCounselorUseCase";
import { GetCounselorListUseCase } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorListUseCase/GetCounselorListUseCase";
import { GetCounselorUseCase } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorUseCase/GetCounselorUseCase";
import { UpdateCounselorUseCase } from "~counselings/aggregates/counselors/applications/useCases/UpdateCounselorUseCase/UpdateCounselorUseCase";
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
    GetCounselorListHandler,
    CreateCounselorUseCase,
    UpdateCounselorUseCase,
    GetCounselorListUseCase,
    GetCounselorUseCase,
    {
      provide: COUNSELOR_REPOSITORY,
      useClass: PsqlCounselorsRepositoryAdaptor,
    },
  ],
  exports: [CreateCounselorUseCase, UpdateCounselorUseCase, GetCounselorListUseCase, GetCounselorUseCase],
})
export class CounselorsModule {}
