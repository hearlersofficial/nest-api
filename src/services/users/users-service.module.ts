import { AuthModule } from "~users/applications/auth/auth.module";
import { UserManagementModule } from "~users/applications/user-management/user-management.module";
import { GrpcUserCommandController } from "~users/presentations/grpc/command/users-command.controller";
import { GrpcUserQueryController } from "~users/presentations/grpc/query/users-query.controller";
import { UsersMessageController } from "~users/presentations/message/users-message.controller";

import { Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { ClientsConfigs, KAFKA_CLIENT } from "~common/system/persistences/typeorm-config";

@Module({
  imports: [
    ClientsModule.registerAsync({ clients: [{ useClass: ClientsConfigs, name: KAFKA_CLIENT }], isGlobal: true }),
    UserManagementModule,
    AuthModule,
  ],
  controllers: [GrpcUserCommandController, GrpcUserQueryController, UsersMessageController],
  providers: [],
})
export class UsersServiceModule implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka) {}
  private readonly logger = new Logger(UsersServiceModule.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("Users Service Module has been initialized");
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
