import { ClientProvider, ClientsModuleOptionsFactory, Transport } from "@nestjs/microservices";
import { KafkaOptions } from "@nestjs/microservices/interfaces";

export interface KafkaCustomableConfig {
  clientId: string;
  groupId: string;
  brokers: string[];
}

const createKafkaOptions = (config: KafkaCustomableConfig): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: config.brokers,
      clientId: config.clientId,
      connectionTimeout: 3000,
      authenticationTimeout: 1000,
      reauthenticationThreshold: 10000,
    },
    consumer: {
      groupId: config.groupId,
      heartbeatInterval: 3000,
      sessionTimeout: 30000,
      maxBytes: 1048576, // 1MB
      maxWaitTimeInMs: 5000,
      allowAutoTopicCreation: true,
      retry: {
        initialRetryTime: 100,
        maxRetryTime: 30000,
        retries: 8,
      },
    },
    producer: {
      allowAutoTopicCreation: false,
      idempotent: true,
      maxInFlightRequests: 5,
      retry: {
        initialRetryTime: 100,
        maxRetryTime: 30000,
      },
    },
    run: {
      autoCommit: false,
    },
  },
});

// 추상 클래스: 바운디드 컨텍스트별 Kafka 클라이언트 설정
export abstract class BaseKafkaClientConfig implements ClientsModuleOptionsFactory {
  abstract getKafkaConfig(): KafkaCustomableConfig;

  getKafkaOptions(): KafkaOptions {
    return createKafkaOptions(this.getKafkaConfig());
  }

  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    return createKafkaOptions(this.getKafkaConfig());
  }
}
