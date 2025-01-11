import { findProtoFiles } from "~shared/utils/Proto.utils";

import { ReflectionService } from "@grpc/reflection";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { GrpcOptions, Transport } from "@nestjs/microservices";

export enum ServiceType {
  APP = "APP",
  USERS = "USERS",
  COUNSELINGS = "COUNSELINGS",
}

export const serviceConfigs = {
  [ServiceType.APP]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50050"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + process.env.PROTO_PATH || "src/proto",
  },
  [ServiceType.USERS]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50051"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + process.env.PROTO_PATH || "src/proto",
  },
  [ServiceType.COUNSELINGS]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50052"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + process.env.PROTO_PATH || "src/proto",
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

export async function createMicroservices(
  module: any,
  serviceName: string,
  config: GrpcServiceConfig,
): Promise<INestApplication> {
  const app = await NestFactory.create(module);
  console.log(config);
  console.log(config.protoPath);
  app.connectMicroservice(createGrpcOptions(serviceName, config), { inheritAppConfig: true });
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
  return app;
}
