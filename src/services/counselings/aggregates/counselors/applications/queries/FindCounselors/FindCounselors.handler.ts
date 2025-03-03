import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { FindCounselorsQuery } from "~counselings/aggregates/counselors/applications/queries/FindCounselors/FindCounselors.query";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselorsQuery)
export class FindCounselorsHandler implements IQueryHandler<FindCounselorsQuery> {
  constructor(private readonly counselorService: CounselorService) {}

  async execute(query: FindCounselorsQuery): Promise<Counselors[]> {
    const { toneId } = query.props;
    const counselors = await this.counselorService.findMany({ toneId });

    return counselors;
  }
}
