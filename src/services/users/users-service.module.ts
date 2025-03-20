import { ClientsConfigs, KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { AuthFacade } from "~users/applications/auth.facade";
import { AuthUsersFacade } from "~users/applications/auth-users.facade";
import { BindAuthUserToUseUseCase } from "~users/applications/use-cases/bind-user-to-auth-user";
import { ConnectAuthChannelUseCase } from "~users/applications/use-cases/connect-auth-channel";
import { UsersFacade } from "~users/applications/users.facade";
import { AuthUsersModule } from "~users/domains/auth-users/auth-users.module";
import { UsersModule } from "~users/domains/users/users.module";
import { GrpcUserCommandController } from "~users/presentations/grpc/command/users-command.controller";
import { GrpcUserQueryController } from "~users/presentations/grpc/query/users-query.controller";
import { UsersMessageController } from "~users/presentations/message/users-message.controller";

import { Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";

@Module({
  imports: [
    UsersModule,
    AuthUsersModule,
    ClientsModule.registerAsync({ clients: [{ useClass: ClientsConfigs, name: KAFKA_CLIENT }], isGlobal: true }),
  ],
  controllers: [GrpcUserCommandController, GrpcUserQueryController, UsersMessageController],
  providers: [UsersFacade, AuthUsersFacade, AuthFacade, BindAuthUserToUseUseCase, ConnectAuthChannelUseCase],
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
