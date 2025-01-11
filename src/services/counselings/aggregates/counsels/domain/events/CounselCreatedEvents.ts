import { DomainEvent } from "~shared/core/domain/events/DomainEvent";
import { CounselCreatedPayload, CounselCreatedPayloadSchema } from "~proto/com/hearlers/v1/message/counsel_pb";

import { toBinary } from "@bufbuild/protobuf";

export class CounselCreatedEvent extends DomainEvent {
  static readonly topic = "counsel.created";
  public readonly payload: CounselCreatedPayload;
  public readonly binary: Uint8Array;

  constructor(payload: CounselCreatedPayload) {
    super();
    this.payload = payload;
    this.binary = toBinary(CounselCreatedPayloadSchema, payload, { writeUnknownFields: false });
  }
}
