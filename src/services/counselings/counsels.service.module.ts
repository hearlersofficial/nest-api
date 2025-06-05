import { CounselManagementsModule } from "~counselings/applications/counsel-managements/counsel-managements.module";
import { CounselPromptManagementsModule } from "~counselings/applications/counsel-prompt-managements/counsel-prompt-managements.module";
import { CounselorManagementsModule } from "~counselings/applications/counselor-managements/counselor-managements.module";
import { GrpcCounselorCommandController } from "~counselings/presentations/grpc/command/counselors-command.controller";
import { GrpcCounselPromptCommandController } from "~counselings/presentations/grpc/command/counselPrompts-command.controller";
import { GrpcCounselCommandController } from "~counselings/presentations/grpc/command/counsels-command.controller";
import { GrpcEpisodeCommandController } from "~counselings/presentations/grpc/command/episodes-command.controller";
import { GrpcCounselorQueryController } from "~counselings/presentations/grpc/query/counselors-query.controller";
import { GrpcCounselPromptQueryController } from "~counselings/presentations/grpc/query/counselPrompts-query.controller";
import { GrpcCounselQueryController } from "~counselings/presentations/grpc/query/counsels-query.controller";
import { GrpcEpisodeQueryController } from "~counselings/presentations/grpc/query/episodes-query.controller";

import { Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { ImageStorageConfig } from "~common/support/image-storage/image-storage.config";
import { ClientsConfigs, KAFKA_CLIENT } from "~common/system/persistences/typeorm-config";

@Module({
  imports: [
    CounselorManagementsModule,
    CounselPromptManagementsModule,
    CounselManagementsModule,
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
