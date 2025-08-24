import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import dotenv from "dotenv";
import { resolve } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config({ path: resolve(__dirname, "../../../../.env") });

dayjs.extend(utc);
dayjs.extend(timezone);

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.POSTGRESQL_HOST,
  port: parseInt(process.env.POSTGRESQL_PORT ?? "5432"),
  username: process.env.POSTGRESQL_USER,
  password: process.env.POSTGRESQL_PASSWORD,
  database: process.env.POSTGRESQL_DATABASE,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  synchronize: false,
  migrations: [resolve(__dirname, "../../../migrations/**/*.ts")],
  migrationsTableName: "typeorm_migrations",
  logging: process.env.NODE_ENV === "development",
  extra: {
    options: "-c timezone=UTC",
  },
};

@Injectable()
export class TypeOrmConfigs implements TypeOrmOptionsFactory {
  constructor() {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return dataSourceOptions;
  }
}

export default new DataSource(dataSourceOptions);
