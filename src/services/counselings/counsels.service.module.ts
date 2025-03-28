import { ClientsConfigs, KAFKA_CLIENT, TypeOrmConfigs } from "~shared/core/infrastructure/Config";
import { AllExceptionFilter } from "~shared/filters/GrpcExceptionFilter";
import { LoggingInterceptor } from "~shared/interceptors/LoggingInterceptor";
import { CounselMessagesFacade } from "~counselings/applications/counselMessages.facade";
import { CounselorsFacade } from "~counselings/applications/counselors.facade";
import { CounselsFacade } from "~counselings/applications/counsels.facade";
import { CounselTechniquesFacade } from "~counselings/applications/counselTechniques.facade";
import { TonesFacade } from "~counselings/applications/tones.facade";
import { GenerateGptResponseUseCase } from "~counselings/applications/use-cases/generate-gpt-response";
import { MakeSystemPromptUseCase } from "~counselings/applications/use-cases/make-system-prompt";
import { ProceedCounselingUseCase } from "~counselings/applications/use-cases/proceed-counseling";
import { TransitionCounselTechniqueUseCase } from "~counselings/applications/use-cases/transition-counselTechique";
import { CounselMessagesModule } from "~counselings/domains/counselMessages/counselMessages.module";
import { CounselorsModule } from "~counselings/domains/counselors/counselors.module";
import { CounselsModule } from "~counselings/domains/counsels/counsels.module";
import { CounselTechniquesModule } from "~counselings/domains/counselTechniques/counselTechniques.module";
import { TonesModule } from "~counselings/domains/tones/tones.module";
import { GrpcCounselCommandController } from "~counselings/presentations/grpc/command/counsels-command.controller";
import { GrpcCounselQueryController } from "~counselings/presentations/grpc/query/counsels-query.controller";

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
    CounselsFacade,
    CounselMessagesFacade,
    CounselorsFacade,
    TonesFacade,
    CounselTechniquesFacade,

    TransitionCounselTechniqueUseCase,
    MakeSystemPromptUseCase,
    GenerateGptResponseUseCase,
    ProceedCounselingUseCase,

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
