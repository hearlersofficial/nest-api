import { toBinary } from "@bufbuild/protobuf";
import { CounselCreatedPayload, CounselCreatedPayloadSchema } from "~/src/gen/com/hearlers/v1/message/counsel_pb";
import { DomainEvent } from "~/src/shared/core/domain/events/DomainEvent";

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
