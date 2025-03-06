import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselService } from "~counselings/aggregates/counsels/applications/counsel.service";
import { FindCounselByIdQuery } from "~counselings/aggregates/counsels/applications/queries/FindCounselById/FindCounselById.query";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { HttpStatus } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(FindCounselByIdQuery)
export class FindCounselByIdHandler {
  constructor(private readonly counselService: CounselService) {}

  async execute(query: FindCounselByIdQuery): Promise<Counsels> {
    const { counselId } = query.props;
    const counsel = await this.counselService.findOne(counselId);

    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }

    return counsel;
  }
}
