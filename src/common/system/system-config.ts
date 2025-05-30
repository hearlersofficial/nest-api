import { ReflectionService } from "@grpc/reflection";
import { GrpcOptions, Transport } from "@nestjs/microservices";
import { findProtoFiles } from "~common/shared/utils/Proto.utils";
import * as dotenv from "dotenv";
dotenv.config({ path: [".env", ".env.dev"] });

export enum ServiceType {
  APP = "APP",
  USERS = "USERS",
  COUNSELINGS = "COUNSELINGS",
}

export const serviceConfigs = {
  [ServiceType.APP]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50051"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
  },
  [ServiceType.USERS]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50051"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
  },
  [ServiceType.COUNSELINGS]: {
    packages: ["com.hearlers.v1.model", "com.hearlers.v1.service", "com.hearlers.v1.common"],
    port: parseInt(process.env.GRPC_PORT || "50051"),
    host: process.env.GRPC_HOST || "localhost",
    protoPath: process.cwd() + (process.env.PROTO_PATH || "/src/proto"),
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
