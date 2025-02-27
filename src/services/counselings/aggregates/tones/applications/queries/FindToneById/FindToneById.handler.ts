import { FindToneByIdQuery } from "~counselings/aggregates/tones/applications/queries/FindToneById/FindToneById.query";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindToneByIdQuery)
export class FindToneByIdHandler implements IQueryHandler<FindToneByIdQuery> {
  constructor(private readonly toneService: ToneService) {}

  async execute(query: FindToneByIdQuery): Promise<Tones> {
    const tone = await this.toneService.getById(query.toneId);
    return tone;
  }
}
