import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Tones } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TonesReader {
  abstract findOne(props: { toneId: UniqueEntityId }): Promise<Tones | null>;
  abstract findMany(props: TonesCriteriaFindMany): Promise<Tones[]>;
}
