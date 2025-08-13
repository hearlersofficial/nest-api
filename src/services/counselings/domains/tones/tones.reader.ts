import { Tones } from "~counselings/domains/tones/models/tones";
import { TonesCriteriaFindMany } from "~counselings/domains/tones/tones.criteria";

import { Injectable } from "@nestjs/common";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

@Injectable()
export abstract class TonesReader {
  abstract findOne(props: { toneId: ToneId }): Promise<Tones | null>;
  abstract getOne(props: { toneId: ToneId }): Promise<Tones>;
  abstract findMany(props: TonesCriteriaFindMany): Promise<Tones[]>;
}
