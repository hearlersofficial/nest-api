import { AuthModule } from "~users/applications/auth/auth.module";
import { UserManagementModule } from "~users/applications/user-management/user-management.module";
import { UsersKafkaClientModule } from "~users/infrastructures/kafka/users-kafka-client.module";
import { GrpcUserCommandController } from "~users/presentations/grpc/command/users-command.controller";
import { GrpcUserQueryController } from "~users/presentations/grpc/query/users-query.controller";
import { UsersMessageController } from "~users/presentations/message/users-message.controller";

import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

@Module({
  imports: [UsersKafkaClientModule, UserManagementModule, AuthModule],
  controllers: [GrpcUserCommandController, GrpcUserQueryController, UsersMessageController],
  providers: [],
})
export class UsersServiceModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}
  private readonly logger = new Logger(UsersServiceModule.name);

  async onModuleInit() {
    // const app = await NestFactory.createMicroservice<MicroserviceOptions>(this.moduleRef, {
    //   transport: Transport.KAFKA,
    //   options: {
    //     client: { brokers: USERS_KAFKA_CONFIG.brokers },
    //     consumer: { groupId: USERS_KAFKA_CONFIG.groupId },
    //   },
    // });
    // this.logger.log("User Service Kafka has been initialized", USERS_KAFKA_CONFIG);
    // await app.listen();
    // this.logger.log("User Service Kafka has been initialized", USERS_KAFKA_CONFIG);
    this.logger.log("User Service has been Initia lized");
  }
}
