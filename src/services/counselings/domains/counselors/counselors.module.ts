import { BubbleEntity } from "~shared/core/infrastructure/entities/counselors/bubble.entity";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { BubblesReader } from "~counselings/domains/counselors/bubbles.reader";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { CounselorsStore } from "~counselings/domains/counselors/counselors.store";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";
import { PsqlCounselorsRepository } from "~counselings/infrastructures/counselors/psql-counselors.repository";
import { RepositoryBubblesReader } from "~counselings/infrastructures/counselors/repository-bubbles.reader";
import { RepositoryCounselorsReader } from "~counselings/infrastructures/counselors/repository-counselors.reader";
import { RepositoryCounselorsStore } from "~counselings/infrastructures/counselors/repository-counselors.store";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

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
