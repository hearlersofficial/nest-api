import { CounselorUserRelationshipsReader } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.reader";
import { CounselorUserRelationshipsService } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.service";
import { CounselorUserRelationshipsStore } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.store";
import { CounselorUserRelationshipsRepository } from "~counselings/domains/counselor-user-relationships/infrastructures/counselor-user-relationships.repository";
import { RepositoryCounselorUserRelationshipsReader } from "~counselings/domains/counselor-user-relationships/infrastructures/repository-counselor-user-relationships.reader";
import { RepositoryCounselorUserRelationshipsStore } from "~counselings/domains/counselor-user-relationships/infrastructures/repository-counselor-user-relationships.store";
import { TypeormCounselorUserRelationshipsRepository } from "~counselings/domains/counselor-user-relationships/infrastructures/typeorm-counselor-user-relationships.repository";
import {
  DEFAULT_DAILY_CAP,
  DEFAULT_RULES,
  RapportCalculator,
} from "~counselings/domains/counselor-user-relationships/rapport-calculator";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/counsels/counselor-user-relationships.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CounselorUserRelationshipsEntity])],
  providers: [
    CounselorUserRelationshipsService,
    {
      provide: CounselorUserRelationshipsRepository,
      useClass: TypeormCounselorUserRelationshipsRepository,
    },
    {
      provide: CounselorUserRelationshipsReader,
      useClass: RepositoryCounselorUserRelationshipsReader,
    },
    {
      provide: CounselorUserRelationshipsStore,
      useClass: RepositoryCounselorUserRelationshipsStore,
    },
    {
      provide: RapportCalculator,
      useFactory: () => new RapportCalculator(DEFAULT_DAILY_CAP, DEFAULT_RULES),
    },
  ],
  exports: [CounselorUserRelationshipsService],
})
export class CounselorUserRelationshipsModule {}
