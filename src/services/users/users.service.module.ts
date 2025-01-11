import { ClientsConfigs, KAFKA_CLIENT, TypeOrmConfigs } from "~shared/core/infrastructure/Config";
import { AllExceptionFilter } from "~shared/filters/GrpcExceptionFilter";
import { LoggingInterceptor } from "~shared/interceptors/LoggingInterceptor";
import { FindOneAuthUserHandler } from "~users/aggregates/authUsers/applications/queries/FindOneAuthUser/FindOneAuthUser.handler";
import { AuthModule } from "~users/aggregates/authUsers/auth.module";
import { UsersModule } from "~users/aggregates/users/users.module";
import { ConnectAuthChannelHandler } from "~users/applications/commands/ConnectAuthChannel/ConnectAuthChannel.handler";
import { InitializeUserHandler } from "~users/applications/commands/InitializeUser/InitializeUser.handler";
import { BindAuthUserToUseUseCase } from "~users/applications/useCases/BindAuthUserToUseUseCase/BindAuthUserToUseUseCase";
import { ConnectAuthChannelUseCase } from "~users/applications/useCases/ConnectAuthChannelUseCase/ConnectAuthChannelUseCase";
import { GrpcUserCommandController } from "~users/presentations/grpc/command/users.command.controller";
import { GrpcUserQueryController } from "~users/presentations/grpc/query/users.query.controller";
import { UsersMessageController } from "~users/presentations/message/users.message.controller";

import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CommandBus, CqrsModule } from "@nestjs/cqrs";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.dev"],
      isGlobal: true,
    }),
    ClientsModule.registerAsync({ clients: [{ useClass: ClientsConfigs, name: KAFKA_CLIENT }], isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigs }),
  ],
  controllers: [GrpcUserCommandController, GrpcUserQueryController, UsersMessageController],
  providers: [
    BindAuthUserToUseUseCase,
    ConnectAuthChannelUseCase,
    ConnectAuthChannelHandler,
    FindOneAuthUserHandler,
    InitializeUserHandler,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class UsersServiceModule implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly commandBus: CommandBus,
  ) {}
  private readonly logger = new Logger(UsersServiceModule.name);

  async onModuleInit() {
    await this.kafkaClient.connect();
    this.logger.log("Users Service Module has been initialized");
    console.log("Registered Handlers:", this.commandBus["handlers"]); // 핸들러 목록 확인
    this.logger.log(`Environment: ${process.env.NODE_ENV}`);
    this.logger.log(`GRPC Port: ${process.env.GRPC_PORT}`);
    this.logger.log(`Kafka Bootstrap Servers: ${process.env.KAFKA_BOOTSTRAP_SERVERS}`);
    this.logger.log(`Kafka Client ID: ${process.env.KAFKA_CLIENT_ID}`);
    this.logger.log(`Kafka Group ID: ${process.env.KAFKA_GROUP_ID}`);
  }
}
