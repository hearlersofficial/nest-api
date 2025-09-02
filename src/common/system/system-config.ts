import { UsersKafkaClientConfig } from "~users/infrastructures/kafka/users-kafka-client-config";
import { CounselingsKafkaClientConfig } from "~counselings/infrastructures/kafka/counseling-kafka-client-config";

import { ReflectionService } from "@grpc/reflection";
import { INestApplication } from "@nestjs/common";
import { GrpcOptions, KafkaOptions, Transport } from "@nestjs/microservices";
import { findProtoFiles } from "~common/shared/utils/proto";
import * as dotenv from "dotenv";
dotenv.config({ path: [".env", ".env.dev"] });

export enum ServiceType {
  APP = "APP",
  USERS = "USERS",
  COUNSELINGS = "COUNSELINGS",
}

type ServiceConfig = {
  grpc: GrpcServiceConfig;
};

export const serviceConfigs: Record<ServiceType, ServiceConfig> = {
  [ServiceType.APP]: {
    grpc: {
      packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
      port: parseInt(process.env.GRPC_PORT || "50051"),
      host: process.env.GRPC_HOST || "localhost",
      protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
    },
  },
  [ServiceType.USERS]: {
    grpc: {
      packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
      port: parseInt(process.env.GRPC_PORT || "50051"),
      host: process.env.GRPC_HOST || "localhost",
      protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
    },
  },
  [ServiceType.COUNSELINGS]: {
    grpc: {
      packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
      port: parseInt(process.env.GRPC_PORT || "50051"),
      host: process.env.GRPC_HOST || "localhost",
      protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
    },
  },
};

export interface GrpcServiceConfig {
  protoPath: string;
  packages: string[];
  port: number;
  host: string;
}

export const createGrpcOptions = (serviceName: string, config: GrpcServiceConfig): GrpcOptions => {
  const protoFiles = findProtoFiles(config.protoPath);
  return {
    transport: Transport.GRPC,
    options: {
      package: config.packages,
      protoPath: protoFiles,
      url: `${config.host}:${config.port}`,
      loader: {
        includeDirs: [config.protoPath],
      },
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server);
      },
    },
  };
};

export const createKafkaOptionsList = (serviceName: string, app: INestApplication<any>): KafkaOptions[] => {
  const kafkaOptionsList: KafkaOptions[] = [];
  let usersKafkaOptions: UsersKafkaClientConfig;
  let counselingsKafkaOptions: CounselingsKafkaClientConfig;

  if (serviceName === ServiceType.USERS || serviceName === ServiceType.APP) {
    usersKafkaOptions = app.get(UsersKafkaClientConfig);
    kafkaOptionsList.push(usersKafkaOptions.getKafkaOptions());
  }
  if (serviceName === ServiceType.COUNSELINGS || serviceName === ServiceType.APP) {
    counselingsKafkaOptions = app.get(CounselingsKafkaClientConfig);
    kafkaOptionsList.push(counselingsKafkaOptions.getKafkaOptions());
  }

  return kafkaOptionsList;
};
