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

  function parseBrokers(v?: string): string[] {
    return (v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const isSaslPlain = process.env.KAFKA_SECURITY === "SASL_PLAIN";
  const brokers = parseBrokers(process.env.KAFKA_BOOTSTRAP_SERVERS);

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers, // 예: ['34.47.88.194:9092']
        clientId: process.env.KAFKA_CLIENT_ID, // 예: 'hearlers-dev-1-server'
        ssl: false, // SASL_PLAIN은 보통 false (SASL_SSL이면 true)
        ...(isSaslPlain
          ? {
              sasl: {
                mechanism: "plain",
                username: process.env.KAFKA_SASL_USERNAME,
                password: process.env.KAFKA_SASL_PASSWORD,
              },
            }
          : {}),
        // 선택: 연결/재시도 튜닝
        connectionTimeout: 10_000,
        requestTimeout: 30_000,
        retry: {
          retries: 8,
          initialRetryTime: 300,
          factor: 0.2,
          multiplier: 2,
          maxRetryTime: 30_000,
        },
      },
      consumer: {
        groupId: process.env.KAFKA_GROUP_ID ?? "hearlers-dev-1-group",
        allowAutoTopicCreation: true,
        // Nest의 consumer.retry는 KafkaJS의 retrier와 별개로 동작(기본은 충분)
        retry: {
          retries: 3,
          initialRetryTime: 100,
          multiplier: 2,
        },
      },
      // 선택: 각 요청에 대한 응답 대기 시간
      // run: { autoCommit: true }, // 커밋 전략 조정 시
      // subscribe: { fromBeginning: false },
    },
  });

  logger.log(`gRPC server configured on ${config.host}:${config.port}`);
  logger.log(`Kafka consumer configured with group: ${process.env.KAFKA_GROUP_ID}`);

  await app.init();
  await app.startAllMicroservices();

  logger.log(`Application started successfully in ${serviceType} mode`);
}

bootstrap();
