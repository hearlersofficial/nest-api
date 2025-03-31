import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorsFacade {
  constructor(private readonly counselorsService: CounselorsService) {}

  @Transactional()
  async createCounselor(params: { toneId: UniqueEntityId; name: string; description: string; counselorGender: CounselorGender }): Promise<Counselors> {
    const { toneId, name, description, counselorGender } = params;
    return this.counselorsService.create({ toneId, name, description, gender: counselorGender });
  }

  async findCounselors(params: { toneId?: UniqueEntityId }): Promise<Counselors[]> {
    const { toneId } = params;
    return this.counselorsService.findMany({ toneId });
  }

  async findCounselorById(params: { counselorId: UniqueEntityId }): Promise<Counselors> {
    const { counselorId } = params;
    return this.counselorsService.getOne({ counselorId });
  }

  @Transactional()
  async updateCounselor(params: {
    counselorId: UniqueEntityId;
    toneId?: UniqueEntityId;
    name?: string;
    description?: string;
    counselorGender?: CounselorGender;
  }): Promise<Counselors> {
    const { counselorId, toneId, name, description, counselorGender } = params;
    const counselor = await this.counselorsService.getOne({ counselorId });
    counselor.update({ toneId, name, description, gender: counselorGender });
    return this.counselorsService.update(counselor);
  }
}
