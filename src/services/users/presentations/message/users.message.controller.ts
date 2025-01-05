import { create } from "@bufbuild/protobuf";
import { Controller, Inject, OnModuleInit } from "@nestjs/common";
import { ClientKafka, Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
} from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { UsersCounselMessageCreatedEvent } from "~/src/services/users/applications/events/CounselMessageCreatedEvents";
import { KAFKA_CLIENT } from "~/src/shared/core/infrastructure/Config";
import { kafkaPayloadToProtoMessage } from "~/src/shared/utils/Proto.utils";

@Controller()
export class UsersMessageController implements OnModuleInit {
  constructor(@Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {}

  // @EventPattern(UserUpdatedEvent.topic)
  // handleUserUpdated(@Payload() payload: string, @Ctx() context: KafkaContext): void {}

  @EventPattern(UsersCounselMessageCreatedEvent.topic)
  handleCounselMessageCreated(@Payload() payload: string, @Ctx() context: KafkaContext): void {
    const convertedPayload: CounselMessageCreatedPayload = kafkaPayloadToProtoMessage<CounselMessageCreatedPayload>(
      payload,
      CounselMessageCreatedPayloadSchema,
    );
    const event = create(CounselMessageCreatedPayloadSchema, convertedPayload);
    console.log(event);
    console.log(context);
    console.log(convertedPayload);
    console.log(convertedPayload.$typeName);
  }
}
