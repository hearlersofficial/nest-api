import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Injectable } from "@nestjs/common";

@Injectable()
export class CounselorsFacade {
  constructor(private readonly counselorsService: CounselorsService) {}

  async createCounselor(params: {
    toneId: UniqueEntityId;
    name: string;
    description: string;
    counselorGender: CounselorGender;
    persona: string;
  }): Promise<Counselors> {
    const { toneId, name, description, counselorGender, persona } = params;
    const counselor = await this.counselorsService.create({ toneId, name, description, gender: counselorGender });
    counselor.updatePersona(persona);
    return this.counselorsService.update(counselor);
  }

  async findCounselors(params: { toneId?: UniqueEntityId }): Promise<Counselors[]> {
    const { toneId } = params;
    return this.counselorsService.findMany({ toneId });
  }

  async findCounselorById(params: { counselorId: UniqueEntityId }): Promise<Counselors> {
    const { counselorId } = params;
    return this.counselorsService.getOne({ counselorId });
  }

  async updateCounselor(params: {
    counselorId: UniqueEntityId;
    toneId?: UniqueEntityId;
    name?: string;
    description?: string;
    counselorGender?: CounselorGender;
    persona?: string;
  }): Promise<Counselors> {
    const { counselorId, toneId, name, description, counselorGender, persona } = params;
    const counselor = await this.counselorsService.getOne({ counselorId });

    counselor.update({ toneId, name, description, gender: counselorGender });
    if (persona) {
      counselor.updatePersona(persona);
    }
    return this.counselorsService.update(counselor);
  }
}
