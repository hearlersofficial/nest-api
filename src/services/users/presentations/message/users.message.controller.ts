import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { kafkaPayloadToProtoMessage } from "~shared/utils/Proto.utils";
import { ConsumeTokensCommand } from "~users/aggregates/users/applications/commands/ConsumeTokens/ConsumeTokens.command";
import { UsersCounselMessageCreatedEvent } from "~users/applications/events/CounselMessageCreatedEvents";
import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
<<<<<<< HEAD
} from "~proto/com/hearlers/v1/message/counsel_pb";

import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ClientKafka, EventPattern, Payload } from "@nestjs/microservices";
=======
} from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { UsersCounselMessageCreatedEvent } from "~/src/services/users/applications/events/CounselMessageCreatedEvents";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { KAFKA_CLIENT } from "~/src/shared/core/infrastructure/Config";
import { kafkaPayloadToProtoMessage } from "~/src/shared/utils/Proto.utils";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립)

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
    await this.commandBus.execute(new ConsumeTokensCommand({ userId: new UniqueEntityId(convertedPayload.userId) }));
  }
}
