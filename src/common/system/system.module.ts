import { Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AllExceptionFilter } from "~common/system/filters/grpc-exception.filter";
import { LoggingInterceptor } from "~common/system/interceptors/logging.interceptor";
import { TypeOrmConfigs } from "~common/system/persistences/typeorm-config";
import { DataSource } from "typeorm";
import { addTransactionalDataSource } from "typeorm-transactional";

/**
 * @name SystemModule
 * @description 애플리케이션에 전역적으로 한번 로딩해야할 DB 커넥션, 필터, Config 등을 담습니다.
 */
@Module({
  imports: [
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
})
export class SystemModule {
  private static readonly logger = new Logger(SystemModule.name);

  onModuleInit() {
    SystemModule.logger.log("App Module has been initialized");
    SystemModule.logger.log(`Environment: ${process.env.NODE_ENV}`);
    SystemModule.logger.log(`GRPC Port: ${process.env.GRPC_PORT}`);
  }
}
