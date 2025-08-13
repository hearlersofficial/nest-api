import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselsReader } from "~counselings/domains/counsels/infrastructures/repository-counsels.reader";
import { RepositoryCounselsStore } from "~counselings/domains/counsels/infrastructures/repository-counsels.store";
import { TypeormCounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsel-messages.repository";
import { TypeormCounselsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsels.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/CounselMessages.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CounselsEntity, CounselMessagesEntity, CounselContextsEntity])],
  providers: [
    CounselsService,
    {
      provide: CounselsRepository,
      useClass: TypeormCounselsRepository,
    },
    {
      provide: CounselMessagesRepository,
      useClass: TypeormCounselMessagesRepository,
    },
    {
      provide: CounselsReader,
      useClass: RepositoryCounselsReader,
    },
    {
      provide: CounselsStore,
      useClass: RepositoryCounselsStore,
    },
  ],
  exports: [CounselsService],
})
export class CounselsModule {}
