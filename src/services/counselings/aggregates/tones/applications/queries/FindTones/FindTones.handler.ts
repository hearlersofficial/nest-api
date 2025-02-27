import { FindTonesQuery } from "~counselings/aggregates/tones/applications/queries/FindTones/FineTones.query";
import { ToneService } from "~counselings/aggregates/tones/applications/tone.service";
import { Tones } from "~counselings/aggregates/tones/domain/tones";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindTonesQuery)
export class FindTonesHandler implements IQueryHandler<FindTonesQuery> {
  constructor(private readonly toneService: ToneService) {}

  async execute(query: FindTonesQuery): Promise<Tones[]> {
    const tones = await this.toneService.findMany(query.props);
    return tones;
  }
}
