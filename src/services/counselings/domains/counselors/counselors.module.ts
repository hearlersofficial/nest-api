import { BubblesReader } from "~counselings/domains/counselors/bubbles.reader";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselorsStore } from "~counselings/domains/counselors/counselors.store";
import { CounselorsRepository } from "~counselings/domains/counselors/infrastructures/counselors.repository";
import { PsqlCounselorsRepository } from "~counselings/domains/counselors/infrastructures/psql-counselors.repository";
import { RepositoryBubblesReader } from "~counselings/domains/counselors/infrastructures/repository-bubbles.reader";
import { RepositoryCounselorsReader } from "~counselings/domains/counselors/infrastructures/repository-counselors.reader";
import { RepositoryCounselorsStore } from "~counselings/domains/counselors/infrastructures/repository-counselors.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BubbleEntity } from "~common/system/persistences/entities/counselors/bubble.entity";
import { CounselorEntity } from "~common/system/persistences/entities/counselors/counselor.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CounselorEntity, BubbleEntity])],
  providers: [
    CounselorsService,
    {
      provide: CounselorsRepository,
      useClass: PsqlCounselorsRepository,
    },
    {
      provide: CounselorsReader,
      useClass: RepositoryCounselorsReader,
    },
    {
      provide: CounselorsStore,
      useClass: RepositoryCounselorsStore,
    },
    {
      provide: BubblesReader,
      useClass: RepositoryBubblesReader,
    },
  ],
  exports: [CounselorsService],
})
export class CounselorsModule {}
