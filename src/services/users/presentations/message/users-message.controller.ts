import { UserManagementFacade } from "~users/applications/user-management/user-management.facade";
import { USERS_KAFKA_CLIENT } from "~users/infrastructures/kafka/users-kafka-client-config";
import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
} from "~proto/com/hearlers/v1/message/counsel_pb";

import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { kafkaPayloadToProtoMessage } from "~common/shared/utils/proto";
import { CounselMessageCreatedEvent } from "~common/shared-kernel/event/counsel-message-created.event";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

@Controller()
export class UsersMessageController implements OnModuleInit {
  constructor(
    @Inject(USERS_KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly usersFacade: UserManagementFacade,
  ) {}

  async onModuleInit() {}

  // @EventPattern(UserUpdatedEvent.topic)
  // handleUserUpdated(@Payload() payload: string, @Ctx() context: KafkaContext): void {}

  @EventPattern(CounselMessageCreatedEvent.topic)
  async handleCounselMessageCreated(@Payload() payload: string): Promise<void> {
    const convertedPayload: CounselMessageCreatedPayload = kafkaPayloadToProtoMessage<CounselMessageCreatedPayload>(
      payload,
      CounselMessageCreatedPayloadSchema,
    );
    console.log("convertedPayload", convertedPayload);
    await this.usersFacade.consumeTokens(new UserId(convertedPayload.userId));
  }
}
