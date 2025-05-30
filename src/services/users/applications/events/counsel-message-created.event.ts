import {
  CounselMessageCreatedPayload,
  CounselMessageCreatedPayloadSchema,
} from "~proto/com/hearlers/v1/message/counsel_pb";

import { toBinary } from "@bufbuild/protobuf";
import { DomainEvent } from "~common/shared-kernel/domains/DomainEvent";

export class UsersCounselMessageCreatedEvent extends DomainEvent {
  static readonly topic = "counsel.message.created";
  public readonly payload: CounselMessageCreatedPayload;
  public readonly binary: Uint8Array;

  constructor(payload: CounselMessageCreatedPayload) {
    super();
    this.payload = payload;
    this.binary = toBinary(CounselMessageCreatedPayloadSchema, payload, { writeUnknownFields: false });
  }
}
