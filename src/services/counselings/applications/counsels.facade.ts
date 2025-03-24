import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsService } from "~counselings/domains/counsels/counsels.service";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CounselsFacade {
  constructor(private readonly counselsService: CounselsService) {}

  async findCounsels(params: { userId: UniqueEntityId; counselorId?: UniqueEntityId }): Promise<Counsels[]> {
    const { userId, counselorId } = params;
    return this.counselsService.findMany({ userId, counselorId });
  }

  async findCounselById(params: { counselId: UniqueEntityId }): Promise<Counsels> {
    const { counselId } = params;
    return this.counselsService.getOne({ counselId });
  }
}
