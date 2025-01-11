import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetPromptListQuery } from "~counselings/aggregates/counselPrompts/applications/queries/GetPromptList/GetPromptList.query";
import { GetCounselPromptListUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptListUseCase/GetCounselPromptListUseCase";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";

import { HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetPromptListQuery)
export class GetPromptListHandler implements IQueryHandler<GetPromptListQuery> {
  constructor(private readonly getCounselPromptListUseCase: GetCounselPromptListUseCase) {}

  async execute(query: GetPromptListQuery): Promise<CounselPrompts[]> {
    const { promptType } = query.props;
    const { ok, error, counselPromptList } = await this.getCounselPromptListUseCase.execute({ promptType });
    if (!ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, error);
    }

    return counselPromptList;
  }
}
