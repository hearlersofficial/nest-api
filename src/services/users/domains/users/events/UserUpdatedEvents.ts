import { DomainEvent } from "~shared/core/domain/events/DomainEvent";
import { UserUpdatedPayload, UserUpdatedPayloadSchema } from "~proto/com/hearlers/v1/message/user_pb";

import { toBinary } from "@bufbuild/protobuf";

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
