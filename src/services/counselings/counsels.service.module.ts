import { ClientsConfigs, KAFKA_CLIENT, TypeOrmConfigs } from "~shared/core/infrastructure/Config";
import { AllExceptionFilter } from "~shared/filters/GrpcExceptionFilter";
import { LoggingInterceptor } from "~shared/interceptors/LoggingInterceptor";
import { ContextsModule } from "~counselings/aggregates/contexts/contexts.module";
import { CounselMessagesModule } from "~counselings/aggregates/counselMessages/counselMessages.module";
import { CounselorsModule } from "~counselings/aggregates/counselors/counselors.module";
import { CounselsModule } from "~counselings/aggregates/counsels/counsels.module";
import { CounselTechniquesModule } from "~counselings/aggregates/counselTechniques/counselTechniques.module";
import { InstructionItemsModule } from "~counselings/aggregates/instructionItems/instructionItems.module";
import { InstructionsModule } from "~counselings/aggregates/instructions/instructions.module";
import { PersonasModule } from "~counselings/aggregates/personas/personas.module";
import { TonesModule } from "~counselings/aggregates/tones/tones.module";
import { CreateCounselHandler } from "~counselings/applications/commands/CreateCounsel/CreateCounsel.handler";
import { CreateMessageHandler } from "~counselings/applications/commands/CreateMessage/CreateMessage.handler";
import { GenerateGptResponseUseCase } from "~counselings/applications/useCases/GenerateGptResponseUseCase/GenerateGptResponseUseCase";
import { InitializeCounselUseCase } from "~counselings/applications/useCases/InitializeCounselUseCase/InitializeCounselUseCase";
import { InitializeCounselWithBubbleUseCase } from "~counselings/applications/useCases/InitializeCounselWithBubbleUseCase/InitializeCounselWithBubbleUseCase";
import { GrpcCounselCommandController } from "~counselings/presentations/grpc/command/counsels.command.controller";
import { GrpcCounselQueryController } from "~counselings/presentations/grpc/query/counsels.query.controller";

import { Inject, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { ClientKafka, ClientsModule } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    CounselsModule,
    CounselMessagesModule,
    CounselorsModule,
    PersonasModule,
    ContextsModule,
    InstructionsModule,
    InstructionItemsModule,
    TonesModule,
    CounselTechniquesModule,
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: [".env", ".env.dev"],
      isGlobal: true,
    }),
    ClientsModule.registerAsync({ clients: [{ useClass: ClientsConfigs, name: KAFKA_CLIENT }], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigs,
    }),
  ],
  controllers: [GrpcCounselCommandController, GrpcCounselQueryController],
  providers: [
    InitializeCounselUseCase,
    InitializeCounselWithBubbleUseCase,
    GenerateGptResponseUseCase,
    CreateCounselHandler,
    CreateMessageHandler,
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
export class CounselsServiceModule implements OnModuleInit {
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
}
