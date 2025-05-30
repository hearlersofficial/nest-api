import { Tones } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export abstract class TonesReader {
  abstract findOne(props: { toneId: UniqueEntityId }): Promise<Tones | null>;
  abstract findMany(props: TonesCriteriaFindMany): Promise<Tones[]>;
}
