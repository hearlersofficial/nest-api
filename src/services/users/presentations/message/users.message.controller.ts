import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
import { ConsumeTokensCommand } from "~/src/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.command";
import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
} from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { UsersCounselMessageCreatedEvent } from "~/src/services/users/applications/events/CounselMessageCreatedEvents";
import { KAFKA_CLIENT } from "~/src/shared/core/infrastructure/Config";
import { kafkaPayloadToProtoMessage } from "~/src/shared/utils/Proto.utils";

@Controller()
export class UsersMessageController implements OnModuleInit {
  constructor(
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
    private readonly commandBus: CommandBus,
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
    await this.commandBus.execute(new ConsumeTokensCommand({ userId: convertedPayload.userId }));
  }
}
