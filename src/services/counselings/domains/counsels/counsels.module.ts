import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { CounselsPersister } from "~counselings/domains/counsels/counsels.persister";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselsRepository } from "~counselings/infrastructures/counsels/counsels.repository";
import { PsqlCounselsRepository } from "~counselings/infrastructures/counsels/psql-counsels.repository";
import { RepositoryCounselsPersister } from "~counselings/infrastructures/counsels/repository-counsels.persister";
import { RepositoryCounselsReader } from "~counselings/infrastructures/counsels/repository-counsels.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([CounselsEntity])],
  providers: [
    CounselsService,
    {
      provide: CounselsRepository,
      useClass: PsqlCounselsRepository,
    },
    {
      provide: CounselsReader,
      useClass: RepositoryCounselsReader,
    },
    {
      provide: CounselsPersister,
      useClass: RepositoryCounselsPersister,
    },
  ],
  exports: [CounselsService],
})
export class CounselsModule {}
