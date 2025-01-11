import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetCounselListQuery } from "~counselings/aggregates/counsels/applications/queries/GetCounselList/GetCounselList.query";
import { GetCounselListUseCase } from "~counselings/aggregates/counsels/applications/useCases/GetCounselListUseCase/GetCounselListUseCase";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetCounselListQuery)
export class GetCounselListHandler implements IQueryHandler<GetCounselListQuery> {
  constructor(private readonly getCounsleListUseCase: GetCounselListUseCase) {}

  async execute(query: GetCounselListQuery): Promise<Counsels[]> {
    const { userId } = query.props;
    const { ok, error, counselList } = await this.getCounsleListUseCase.execute({ userId });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }

    return counselList;
  }
}
