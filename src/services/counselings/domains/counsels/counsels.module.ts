import { CounselsPersister } from "~counselings/domains/counsels/counsels.persister";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { PsqlCounselsRepository } from "~counselings/domains/counsels/infrastructures/psql-counsels.repository";
import { RepositoryCounselsPersister } from "~counselings/domains/counsels/infrastructures/repository-counsels.persister";
import { RepositoryCounselsReader } from "~counselings/domains/counsels/infrastructures/repository-counsels.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";

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
