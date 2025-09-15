import { AllianceAnalyzer } from "~counselings/domains/counsels/analyzers/alliance.analyzer";
import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextReviewer } from "~counselings/domains/counsels/analyzers/context-reviewer";
import { EmotionAnalyzer } from "~counselings/domains/counsels/analyzers/emotion.analyzer";
import { ImpactTimeframeAnalyzer } from "~counselings/domains/counsels/analyzers/impact-timeframe.analyzer";
import { MotivationAnalyzer } from "~counselings/domains/counsels/analyzers/motivation.analyzer";
import { RiskAnalyzer } from "~counselings/domains/counsels/analyzers/risk.analyzer";
import { SupportSleepCognitiveAnalyzer } from "~counselings/domains/counsels/analyzers/support-sleep-cognitive.analyzer";
import { ContextOrganizer } from "~counselings/domains/counsels/context.organizer";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselAnalyzer } from "~counselings/domains/counsels/counsel.analyzer";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CompressedMessagesRepository } from "~counselings/domains/counsels/infrastructures/compressed-messages.repository";
import { CounselCompressConditionsRepository } from "~counselings/domains/counsels/infrastructures/counsel-compress-conditions.repository";
import { CounselContextsRepository } from "~counselings/domains/counsels/infrastructures/counsel-contexts.repository";
import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { RepositoryCounselsReader } from "~counselings/domains/counsels/infrastructures/repository-counsels.reader";
import { RepositoryCounselsStore } from "~counselings/domains/counsels/infrastructures/repository-counsels.store";
import { TypeormCompressedMessagesRepository } from "~counselings/domains/counsels/infrastructures/typeorm-compressed-messages.repository";
import { TypeormCounselCompressConditionsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsel-compress-conditions.repository";
import { TypeormCounselContextsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsel-contexts.repository";
import { TypeormCounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsel-messages.repository";
import { TypeormCounselsRepository } from "~counselings/domains/counsels/infrastructures/typeorm-counsels.repository";
import { MessageCompressor } from "~counselings/domains/counsels/message.compressor";
import { CounselingKafkaClientModule } from "~counselings/infrastructures/kafka/counseling-kafka-client.module";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssistantAgentModule } from "~common/support/assistant-agents/assistant-agent.module";
import { CompressedMessagesEntity } from "~common/system/persistences/entities/counsels/compressed-messages.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { CounselCompressConditionsEntity } from "~common/system/persistences/entities/counsels/counsel-compress-conditions.entity";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/counsel-messages.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CounselsEntity,
      CounselMessagesEntity,
      CounselContextsEntity,
      CounselCompressConditionsEntity,
      CompressedMessagesEntity,
    ]),
    CounselingKafkaClientModule,
    AssistantAgentModule,
  ],
  providers: [
    CounselsService,
    MessageCompressor,
    CounselAnalyzer,
    ContextOrganizer,
    ContextReviewer,
    EmotionAnalyzer,
    RiskAnalyzer,
    MotivationAnalyzer,
    SupportSleepCognitiveAnalyzer,
    ImpactTimeframeAnalyzer,
    AllianceAnalyzer,
    {
      provide: "CONTEXT_DOMAIN_ANALYZERS",
      useFactory: (
        emotion: EmotionAnalyzer,
        risk: RiskAnalyzer,
        motivation: MotivationAnalyzer,
        supportSleepCognitive: SupportSleepCognitiveAnalyzer,
        impactTimeframe: ImpactTimeframeAnalyzer,
        alliance: AllianceAnalyzer,
      ): BaseDomainAnalyzer[] => [emotion, risk, motivation, supportSleepCognitive, impactTimeframe, alliance],
      inject: [
        EmotionAnalyzer,
        RiskAnalyzer,
        MotivationAnalyzer,
        SupportSleepCognitiveAnalyzer,
        ImpactTimeframeAnalyzer,
        AllianceAnalyzer,
      ],
    },
    ConversationHistoryBuilder,
    {
      provide: CounselsRepository,
      useClass: TypeormCounselsRepository,
    },
    {
      provide: CounselMessagesRepository,
      useClass: TypeormCounselMessagesRepository,
    },
    {
      provide: CounselContextsRepository,
      useClass: TypeormCounselContextsRepository,
    },
    {
      provide: CounselCompressConditionsRepository,
      useClass: TypeormCounselCompressConditionsRepository,
    },
    {
      provide: CompressedMessagesRepository,
      useClass: TypeormCompressedMessagesRepository,
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
