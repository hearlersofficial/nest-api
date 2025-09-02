import { Injectable } from "@nestjs/common";
import { BaseKafkaClientConfig, KafkaCustomableConfig } from "~common/system/persistences/client-config";
import process from "process";

export const USERS_KAFKA_CLIENT = Symbol("USERS_KAFKA_CLIENT");

@Injectable()
export class UsersKafkaClientConfig extends BaseKafkaClientConfig {
  getKafkaConfig(): KafkaCustomableConfig {
    if (!process.env.KAFKA_USERS_CLIENT_ID) {
      throw new Error("KAFKA_USERS_CLIENT_ID is not set");
    }
    if (!process.env.KAFKA_USERS_GROUP_ID) {
      throw new Error("KAFKA_USERS_GROUP_ID is not set");
    }
    if (!process.env.KAFKA_BOOTSTRAP_SERVERS) {
      throw new Error("KAFKA_BOOTSTRAP_SERVERS is not set");
    }
    return {
      clientId: process.env.KAFKA_USERS_CLIENT_ID ?? "users-service",
      groupId: process.env.KAFKA_USERS_GROUP_ID ?? "users-group",
      brokers: [process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092"],
    };
  }
}
