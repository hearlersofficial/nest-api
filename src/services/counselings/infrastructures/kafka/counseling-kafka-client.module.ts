import {
  COUNSELINGS_KAFKA_CLIENT,
  CounselingsKafkaClientConfig,
} from "~counselings/infrastructures/kafka/counseling-kafka-client-config";

import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { OnModuleDestroy } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [{ useClass: CounselingsKafkaClientConfig, name: COUNSELINGS_KAFKA_CLIENT }],
      isGlobal: false,
    }),
  ],
  exports: [ClientsModule],
})
export class CounselingKafkaClientModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(COUNSELINGS_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka) {}
  private readonly logger = new Logger(CounselingKafkaClientModule.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("Counselings Kafka Client Module has been initialized");
  }

  async onModuleDestroy() {
    try {
      await this.kafkaClient.close();
      this.logger.log("Counselings Kafka Client has been disconnected successfully");
    } catch (error) {
      this.logger.error("Error while disconnecting Counseling Kafka Client:", error);
    }
  }
}
