import { CounselorService } from "~counselings/aggregates/counselors/applications/counselor.service";
import { FindCounselorByIdQuery } from "~counselings/aggregates/counselors/applications/queries/FindCounselorById/FindCounselorById.query";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselorByIdQuery)
export class FindCounselorByIdHandler {
  constructor(private readonly counselorService: CounselorService) {}

  async execute(query: FindCounselorByIdQuery): Promise<Counselors> {
    const { counselorId } = query.props;
    const counselor = await this.counselorService.findOne(counselorId);

    return counselor;
  }
}
