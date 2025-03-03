import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { FindCounselsQuery } from "~counselings/aggregates/counsels/applications/queries/FindCounsels/FindCounsels.query";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselsQuery)
export class FindCounselsHandler implements IQueryHandler<FindCounselsQuery> {
  constructor(private readonly counselService: CounselService) {}

  async execute(query: FindCounselsQuery): Promise<Counsels[]> {
    const { userId, counselorId } = query.props;
    const counsels = await this.counselService.findMany({ userId, counselorId });

    return counsels;
  }
}
