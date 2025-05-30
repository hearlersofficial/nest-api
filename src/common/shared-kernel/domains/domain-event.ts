import { Message } from "@bufbuild/protobuf";

export abstract class DomainEvent {
  static readonly topic: string;
  abstract readonly payload: Message;
  abstract readonly binary: Uint8Array;
  readonly topic: string;

  constructor() {
    this.topic = (this.constructor as typeof DomainEvent).topic;
  }
}
