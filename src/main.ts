import { ModularMonolithModule } from "~/src/services/modular-monolith.module";
import { UsersServiceModule } from "~users/users-service.module";
import { CounselsServiceModule } from "~counselings/counsels.service.module";

import { DynamicModule, Logger, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { SystemModule } from "~common/system/system.module";
import { createGrpcOptions, serviceConfigs, ServiceType } from "~common/system/system-config";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import * as dotenv from "dotenv";
import { initializeTransactionalContext } from "typeorm-transactional";

dotenv.config({ path: [".env", ".env.dev"] });

// 동적 애플리케이션 모듈 생성
function createAppModule(serviceType: ServiceType): DynamicModule {
  const logger = new Logger("DynamicAppModule");

  const serviceModules = (() => {
    switch (serviceType) {
      case ServiceType.USERS:
        logger.log("Loading USERS service modules");
        return UsersServiceModule;
      case ServiceType.COUNSELINGS:
        logger.log("Loading COUNSELINGS service modules");
        return CounselsServiceModule;
      case ServiceType.APP:
        logger.log("Loading ALL service modules (monolith mode)");
        return ModularMonolithModule;
      default:
        throw new Error(`Invalid SERVICE_TYPE: ${serviceType}`);
    }
  })();

  @Module({
    imports: [SystemModule, serviceModules],
  })
  class DynamicAppModule {
    onModuleInit() {
      logger.log(`Dynamic App Module initialized for service type: ${serviceType}`);
      logger.log(`Loaded modules: SystemModule, ${serviceModules.name}`);
    }
  }

  return {
    module: DynamicAppModule,
  };
}

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();

  dayjs.extend(utc);
  dayjs.extend(isBetween);

  const serviceType = process.env.SERVICE_TYPE as ServiceType;
  const logger = new Logger("Bootstrap");

  if (!serviceType || !(serviceType in ServiceType)) {
    throw new Error(`Invalid SERVICE_TYPE. Must be one of: ${Object.values(ServiceType).join(", ")}`);
  }

  logger.log(`Starting application in ${serviceType} mode`);

  // 동적으로 앱 모듈 생성
  const dynamicModule = createAppModule(serviceType);
  const config = serviceConfigs[serviceType];

  // NestJS 애플리케이션 생성
  const app = await NestFactory.create(dynamicModule);

  // gRPC 마이크로서비스 설정
  app.connectMicroservice(createGrpcOptions(serviceType, config), {
    inheritAppConfig: true,
  });

  // Kafka 마이크로서비스 설정
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS],
        clientId: process.env.KAFKA_CLIENT_ID,
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID,
        allowAutoTopicCreation: true,
        retry: {
          retries: 3,
          initialRetryTime: 100,
          multiplier: 2,
        },
      },
    },
  });

  logger.log(`gRPC server configured on ${config.host}:${config.port}`);
  logger.log(`Kafka consumer configured with group: ${process.env.KAFKA_GROUP_ID}`);

  await app.init();
  await app.startAllMicroservices();

  logger.log(`Application started successfully in ${serviceType} mode`);
}

bootstrap();
