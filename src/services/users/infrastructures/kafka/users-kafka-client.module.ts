import { USERS_KAFKA_CLIENT, UsersKafkaClientConfig } from "~users/infrastructures/kafka/users-kafka-client-config";

import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { OnModuleDestroy } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [{ useClass: UsersKafkaClientConfig, name: USERS_KAFKA_CLIENT }],
      isGlobal: false,
    }),
  ],
  exports: [ClientsModule],
})
export class UsersKafkaClientModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(USERS_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka) {}
  private readonly logger = new Logger(UsersKafkaClientModule.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("Users Kafka Client Module has been initialized");
  }

  async onModuleDestroy() {
    try {
      await this.kafkaClient.close();
      this.logger.log("Users Kafka Client has been disconnected successfully");
    } catch (error) {
      this.logger.error("Error while disconnecting Users Kafka Client:", error);
    }
  }
}
