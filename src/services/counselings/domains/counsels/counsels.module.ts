import { ContextCompressor } from "~counselings/domains/counsels/context.compressor";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CompressedContextsRepository } from "~counselings/domains/counsels/infrastructures/compressed-contexts.repository";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselsReader } from "~counselings/domains/counsels/infrastructures/repository-counsels.reader";
import { RepositoryCounselsStore } from "~counselings/domains/counsels/infrastructures/repository-counsels.store";
import { TypeormCompressedContextsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-compressed-context.repository";
import { TypeormCounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsel-messages.repository";
import { TypeormCounselsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsels.repository";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssistantAgentModule } from "~common/support/assistant-agents/assistant-agent.module";
import { CompressedContextsEntity } from "~common/system/persistences/entities/counsels/CompressedContexts.entity";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/CounselMessages.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([CounselsEntity, CounselMessagesEntity, CounselContextsEntity, CompressedContextsEntity]),
    AssistantAgentModule,
  ],
  providers: [
    CounselsService,
    ContextCompressor,
    {
      provide: CounselsRepository,
      useClass: TypeormCounselsRepository,
    },
    {
      provide: CounselMessagesRepository,
      useClass: TypeormCounselMessagesRepository,
    },
    {
      provide: CompressedContextsRepository,
      useClass: TypeormCompressedContextsRepository,
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
