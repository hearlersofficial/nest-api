import { CounselMessageService } from "~counselings/aggregates/counselMessages/applications/counselMessage.service";
import { FindMessagesQuery } from "~counselings/aggregates/counselMessages/applications/queries/FindMessages/FindMessages.query";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";

import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindMessagesQuery)
export class FindMessagesHandler implements IQueryHandler<FindMessagesQuery> {
  constructor(private readonly counselMessageService: CounselMessageService) {}

  async execute(query: FindMessagesQuery): Promise<CounselMessages[]> {
    const { counselId } = query.props;
    const counselMessages = await this.counselMessageService.findMany({ counselId });

    return counselMessages;
  }
}
