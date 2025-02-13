import { Module } from "@nestjs/common";
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";
import { COUNSELOR_REPOSITORY } from "./infrastructures/counselors.repository.port";
import { PsqlCounselorsRepositoryAdaptor } from "./infrastructures/adaptors/psql.counselors.repository.adaptor";
import { CreateCounselorUseCase } from "./applications/useCases/CreateCounselorUseCase/CreateCounselorUseCase";
import { GetCounselorUseCase } from "./applications/useCases/GetCounselorUseCase/GetCounselorUseCase";
import { GetCounselorListUseCase } from "./applications/useCases/GetCounselorListUseCase/GetCounselorListUseCase";
import { UpdateCounselorUseCase } from "./applications/useCases/UpdateCounselorUseCase/UpdateCounselorUseCase";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CreateCounselorHandler } from "./applications/commands/CreateCounselor/CreateCounselor.handler";
import { UpdateCounselorHandler } from "./applications/commands/UpdateCounselor/UpdateCounselor.handler";
import { GetCounselorListHandler } from "./applications/queries/GetCounselorList/GetCounselorList.handler";

const useCases = [CreateCounselorUseCase, GetCounselorUseCase, GetCounselorListUseCase, UpdateCounselorUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([CounselorsEntity])],
  providers: [
    ...useCases,
    CreateCounselorHandler,
    UpdateCounselorHandler,
    GetCounselorListHandler,
    {
      provide: COUNSELOR_REPOSITORY,
      useClass: PsqlCounselorsRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class CounselorsModule {}
