import { TypeOrmConfigs } from "~shared/core/infrastructure/Config";
import { ServiceType } from "~shared/core/presentations/Config";
import { AllExceptionFilter } from "~shared/filters/GrpcExceptionFilter";
import { LoggingInterceptor } from "~shared/interceptors/LoggingInterceptor";
import { UsersServiceModule } from "~users/users-service.module";
import { CounselsServiceModule } from "~counselings/counsels.service.module";

import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

@Module({})
export class AppModule {
  private static readonly logger = new Logger(AppModule.name);

  static register(): DynamicModule {
    const serviceType = process.env.SERVICE_TYPE as ServiceType;

    const importedModules = (() => {
      switch (serviceType) {
        case ServiceType.USERS:
          return [UsersServiceModule];
        case ServiceType.COUNSELINGS:
          return [CounselsServiceModule];
        case ServiceType.APP:
          return [UsersServiceModule, CounselsServiceModule];
        default:
          throw new Error(`Invalid SERVICE_TYPE: ${serviceType}`);
      }
    })();

    this.logger.log(`Initializing AppModule for service type: ${serviceType}`);

    return {
      module: AppModule,
      imports: [
        ...importedModules,
        ConfigModule.forRoot({
          envFilePath: [".env", ".env.dev"],
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigs,
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error("Invalid options passed");
            }
            const dataSource = new DataSource(options);
            addTransactionalDataSource(dataSource);
            return dataSource;
          },
        }),
      ],
      providers: [
        {
          provide: APP_FILTER,
          useClass: AllExceptionFilter,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
      ],
    };
  }

  onModuleInit() {
    AppModule.logger.log("App Module has been initialized");
    AppModule.logger.log(`Environment: ${process.env.NODE_ENV}`);
    AppModule.logger.log(`GRPC Port: ${process.env.GRPC_PORT}`);
  }
}
