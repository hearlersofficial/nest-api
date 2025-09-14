import { Injectable } from "@nestjs/common";
import { BaseKafkaClientConfig, KafkaCustomableConfig } from "~common/system/persistences/client-config";
import process from "process";

export const COUNSELINGS_KAFKA_CLIENT = Symbol("COUNSELINGS_KAFKA_CLIENT");

@Injectable()
export class CounselingsKafkaClientConfig extends BaseKafkaClientConfig {
  getKafkaConfig(): KafkaCustomableConfig {
    if (!process.env.KAFKA_COUNSELINGS_CLIENT_ID) {
      throw new Error("KAFKA_COUNSELINGS_CLIENT_ID is not set");
    }
    if (!process.env.KAFKA_COUNSELINGS_GROUP_ID) {
      throw new Error("KAFKA_COUNSELINGS_GROUP_ID is not set");
    }
    if (!process.env.KAFKA_BOOTSTRAP_SERVERS) {
      throw new Error("KAFKA_BOOTSTRAP_SERVERS is not set");
    }
    return {
      clientId: process.env.KAFKA_COUNSELINGS_CLIENT_ID ?? "counselings-service",
      groupId: process.env.KAFKA_COUNSELINGS_GROUP_ID ?? "counselings-group",
      brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092").split(","),
    };
  }
}
