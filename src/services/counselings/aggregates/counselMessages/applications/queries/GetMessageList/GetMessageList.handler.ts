import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetMessageListQuery } from "~counselings/aggregates/counselMessages/applications/queries/GetMessageList/GetMessageList.query";
import { GetCounselMessageListUseCase } from "~counselings/aggregates/counselMessages/applications/useCases/GetCounselMessageListUseCase/GetCounselMessageListUseCase";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetMessageListQuery)
export class GetMessageListHandler implements IQueryHandler<GetMessageListQuery> {
  constructor(private readonly getCounselMessageListUseCase: GetCounselMessageListUseCase) {}

  async execute(query: GetMessageListQuery): Promise<CounselMessages[]> {
    const { counselId } = query.props;
    const { ok, error, counselMessageList } = await this.getCounselMessageListUseCase.execute({ counselId });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }

    return counselMessageList;
  }
}
