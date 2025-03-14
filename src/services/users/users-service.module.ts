import { ClientsConfigs, KAFKA_CLIENT, TypeOrmConfigs } from "~shared/core/infrastructure/Config";
import { DomainEventsModule } from "~shared/core/infrastructure/events/domain-events.module";
import { DomainEventsInterceptor } from "~shared/core/infrastructure/interceptors/domain-events.interceptor";
import { AllExceptionFilter } from "~shared/filters/GrpcExceptionFilter";
import { LoggingInterceptor } from "~shared/interceptors/LoggingInterceptor";
import { CheckRemainingTokensHandler } from "~users/applications/handlers/CheckRemainingTokens.handler";
import { ConnectAuthChannelHandler } from "~users/applications/handlers/ConnectAuthChannel.handler";
import { ConsumeTokensHandler } from "~users/applications/handlers/ConsumeTokens.handler";
import { FindOneAuthUserHandler } from "~users/applications/handlers/FindOneAuthUser.handler";
import { FindOneUserHandler } from "~users/applications/handlers/FindOneUser.handler";
import { InitializeUserHandler } from "~users/applications/handlers/InitializeUser.handler";
import { ReserveTokensHandler } from "~users/applications/handlers/ReserveTokens.handler";
import { SaveRefreshTokenHandler } from "~users/applications/handlers/SaveRefreshToken.handler";
import { UpdateAuthorityHandler } from "~users/applications/handlers/UpdateAuthority.handler";
import { UpdateUserHandler } from "~users/applications/handlers/UpdateUser.handler";
import { VerifyRefreshTokenHandler } from "~users/applications/handlers/VerifyRefreshToken.handler";
import { BindAuthUserToUseUseCase } from "~users/applications/useCases/BindAuthUserToUseUseCase/BindAuthUserToUseUseCase";
import { ConnectAuthChannelUseCase } from "~users/applications/useCases/ConnectAuthChannelUseCase/ConnectAuthChannelUseCase";
import { AuthUsersModule } from "~users/domains/auth-users/auth-users.module";
import { UsersModule } from "~users/domains/users/users.module";
import { GrpcUserCommandController } from "~users/presentations/grpc/command/users-command.controller";
import { GrpcUserQueryController } from "~users/presentations/grpc/query/users-query.controller";
import { UsersMessageController } from "~users/presentations/message/users-message.controller";

import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CommandBus, CqrsModule } from "@nestjs/cqrs";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    DomainEventsModule,
    UsersModule,
    AuthUsersModule,
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
    FindOneUserHandler,
    UpdateUserHandler,
    CheckRemainingTokensHandler,
    ReserveTokensHandler,
    ConsumeTokensHandler,
    InitializeUserHandler,
    ConnectAuthChannelHandler,
    SaveRefreshTokenHandler,
    VerifyRefreshTokenHandler,
    UpdateAuthorityHandler,
    FindOneAuthUserHandler,
    BindAuthUserToUseUseCase,
    ConnectAuthChannelUseCase,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DomainEventsInterceptor,
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
