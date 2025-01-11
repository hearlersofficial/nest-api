import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetCounselorListQuery } from "~counselings/aggregates/counselors/applications/queries/GetCounselorList/GetCounselorList.query";
import { GetCounselorListUseCase } from "~counselings/aggregates/counselors/applications/useCases/GetCounselorListUseCase/GetCounselorListUseCase";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCounselorListQuery)
export class GetCounselorListHandler implements IQueryHandler<GetCounselorListQuery> {
  constructor(private readonly getCounselorListUseCase: GetCounselorListUseCase) {}

  async execute(query: GetCounselorListQuery): Promise<Counselors[]> {
    const { counselorType } = query.props;
    const getCounselorListResult = await this.getCounselorListUseCase.execute({ counselorType });
    if (!getCounselorListResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, getCounselorListResult.error);
    }
    const counselorList = getCounselorListResult.counselorList;

    return counselorList;
  }
}
