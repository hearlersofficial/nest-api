import { toBinary } from "@bufbuild/protobuf";
import { UserUpdatedPayload, UserUpdatedPayloadSchema } from "~/src/gen/com/hearlers/v1/message/user_pb";
import { DomainEvent } from "~/src/shared/core/domain/events/DomainEvent";

export class UserUpdatedEvent extends DomainEvent {
  static readonly topic = "user.updated";
  public readonly payload: UserUpdatedPayload;
  public readonly binary: Uint8Array;

  constructor(payload: UserUpdatedPayload) {
    super();
    this.payload = payload;
    this.binary = toBinary(UserUpdatedPayloadSchema, payload, { writeUnknownFields: false });
  }
}
