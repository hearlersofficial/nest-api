import { ClientsConfigs, KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { ImageStorageConfig } from "~shared/core/infrastructure/image-storage";
import { CounselMessagesFacade } from "~counselings/applications/counselMessages.facade";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { CounselsFacade } from "~counselings/applications/counsels.facade";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { EpisodesFacade } from "~counselings/applications/episodes.facade";
import { LlmFacade } from "~counselings/applications/llm.facade";
import { PersonaPromptsFacade } from "~counselings/applications/personaPrompts.facade";
import { PromptActivateHistoryFacade } from "~counselings/applications/promptActivateHistory.facade";
import { PromptVersionsFacade } from "~counselings/applications/promptVersions.facade";
import { TonePromptsFacade } from "~counselings/applications/tonePrompts.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { MakeSystemPromptUseCase } from "~counselings/applications/use-cases/make-system-prompt";
import { ProceedCounselingUseCase } from "~counselings/applications/use-cases/proceed-counseling";
import { TransitionCounselTechniqueUseCase } from "~counselings/applications/use-cases/transition-counselTechique";
import { ValidatePromptVersionUseCase } from "~counselings/applications/use-cases/validate-prompt-version";
import { CounselMessagesModule } from "~counselings/domains/counselMessages/counselMessages.module";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { CounselsModule } from "~counselings/domains/counsels/counsels.module";
import { CounselTechniquesModule } from "~counselings/domains/counselTechniques/counselTechniques.module";
import { EpisodesModule } from "~counselings/domains/episodes/episodes.module";
import { LlmModule } from "~counselings/domains/llm/llm.module";
import { PersonaPromptsModule } from "~counselings/domains/personaPrompts/personaPrompts.module";
import { PromptActivateHistoryModule } from "~counselings/domains/promptActivateHistory/promptActivateHistory.module";
import { PromptVersionsModule } from "~counselings/domains/promptVersions/promptVersions.module";
import { TonePromptsModule } from "~counselings/domains/tonePrompts/tonePrompts.module";
import { TonesModule } from "~counselings/domains/tones/tones.module";
import { GrpcCounselorCommandController } from "~counselings/presentations/grpc/command/counselors-command.controller";
import { GrpcCounselPromptCommandController } from "~counselings/presentations/grpc/command/counselPrompts-command.controller";
import { GrpcCounselCommandController } from "~counselings/presentations/grpc/command/counsels-command.controller";
import { GrpcEpisodeCommandController } from "~counselings/presentations/grpc/command/episodes-command.controller";
import { GrpcCounselorQueryController } from "~counselings/presentations/grpc/query/counselors-query.controller";
import { GrpcCounselPromptQueryController } from "~counselings/presentations/grpc/query/counselPrompts-query.controller";
import { GrpcCounselQueryController } from "~counselings/presentations/grpc/query/counsels-query.controller";
import { GrpcEpisodeQueryController } from "~counselings/presentations/grpc/query/episodes-query.controller";

import { Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    CqrsModule,
    CounselsModule,
    CounselMessagesModule,
    CounselorsModule,
    TonesModule,
    EpisodesModule,
    PromptVersionsModule,
    PersonaPromptsModule,
    TonePromptsModule,
    CounselTechniquesModule,
    PromptActivateHistoryModule,
    LlmModule,
    ClientsModule.registerAsync({ clients: [{ useClass: ClientsConfigs, name: KAFKA_CLIENT }], isGlobal: true }),
  ],
  controllers: [
    GrpcCounselCommandController,
    GrpcCounselorCommandController,
    GrpcCounselPromptCommandController,
    GrpcCounselQueryController,
    GrpcCounselorQueryController,
    GrpcCounselPromptQueryController,
    GrpcEpisodeCommandController,
    GrpcEpisodeQueryController,
  ],
  providers: [
    ImageStorageConfig.register({
      prefix: "counselings",
    }),
    CounselsFacade,
    CounselMessagesFacade,
    CounselorsFacade,
    TonesFacade,
    PromptVersionsFacade,
    PersonaPromptsFacade,
    TonePromptsFacade,
    CounselTechniquesFacade,
    EpisodesFacade,
    PromptActivateHistoryFacade,
    LlmFacade,
    TransitionCounselTechniqueUseCase,
    MakeSystemPromptUseCase,
    ProceedCounselingUseCase,
    ValidatePromptVersionUseCase,
  ],
})
export class CounselsServiceModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka) {}
  private readonly logger = new Logger(CounselsServiceModule.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("Counselings Service Module has been initialized");
    this.logger.log(`Environment: ${process.env.NODE_ENV}`);
    this.logger.log(`GRPC Port: ${process.env.GRPC_PORT}`);
    this.logger.log(`Kafka Bootstrap Servers: ${process.env.KAFKA_BOOTSTRAP_SERVERS}`);
    this.logger.log(`Kafka Client ID: ${process.env.KAFKA_CLIENT_ID}`);
    this.logger.log(`Kafka Group ID: ${process.env.KAFKA_GROUP_ID}`);
  }

  async onModuleDestroy() {
    try {
      await this.kafkaClient.close();
      this.logger.log("Kafka client has been disconnected successfully");
    } catch (error) {
      this.logger.error("Error while disconnecting Kafka client:", error);
    }
  }
}
