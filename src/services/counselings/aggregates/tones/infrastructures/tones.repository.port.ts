import { Tones } from "~counselings/aggregates/tones/domain/tones";

export const TONE_REPOSITORY = Symbol("TONES_REPOSITORY");

export interface ToneRepositoryPort {
  create(tone: Tones): Promise<Tones>;
  update(tone: Tones): Promise<Tones>;
  findOne(toneId: string): Promise<Tones>;
  findAll(): Promise<Tones[]>;
}
