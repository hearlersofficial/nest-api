import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorsStore } from "~counselings/domains/counselors/counselors.store";
import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors, CounselorsNewProps } from "~counselings/domains/counselors/models/counselors";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselorsStore extends CounselorsStore {
  constructor(private readonly counselorRepository: CounselorsRepository) {
    super();
  }

  override async create(newProps: CounselorsNewProps): Promise<Counselors> {
    const counselorResult = Counselors.createNew(newProps);
    if (counselorResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselorResult.error as string);
    }
    return this.counselorRepository.save(counselorResult.value);
  }

  override async update(counselor: Counselors): Promise<Counselors> {
    return this.counselorRepository.save(counselor);
  }

  override async updateMany(counselors: Counselors[]): Promise<Counselors[]> {
    return this.counselorRepository.save(counselors);
  }

  override async storeBubble(counselor: Counselors, bubble: Bubbles): Promise<Bubbles> {
    return this.counselorRepository.saveBubble(counselor, bubble);
  }
}
