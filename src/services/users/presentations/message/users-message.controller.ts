import { UsersCounselMessageCreatedEvent } from "~users/applications/events/counsel-message-created.event";
import { UsersFacade } from "~users/applications/users.facade";
import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
} from "~proto/com/hearlers/v1/message/counsel_pb";

import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { kafkaPayloadToProtoMessage } from "~common/shared/utils/proto";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { KAFKA_CLIENT } from "~common/system/persistences/typeorm-config";

@Controller()
export class UsersMessageController implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly usersFacade: UsersFacade,
  ) {}

  async onModuleInit() {}

  // @EventPattern(UserUpdatedEvent.topic)
  // handleUserUpdated(@Payload() payload: string, @Ctx() context: KafkaContext): void {}

  @EventPattern(UsersCounselMessageCreatedEvent.topic)
  async handleCounselMessageCreated(@Payload() payload: string): Promise<void> {
    const convertedPayload: CounselMessageCreatedPayload = kafkaPayloadToProtoMessage<CounselMessageCreatedPayload>(
      payload,
      CounselMessageCreatedPayloadSchema,
    );
    await this.usersFacade.consumeTokens(new UniqueEntityId(convertedPayload.userId));
  }
}
