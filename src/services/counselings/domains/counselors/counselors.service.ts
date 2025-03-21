import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { CounselorsPersister } from "~counselings/domains/counselors/counselors.persister";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { Counselors, CounselorsNewProps } from "~counselings/domains/counselors/models/counselors";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CounselorsService {
  constructor(private readonly counselorsReader: CounselorsReader, private readonly counselorPersister: CounselorsPersister) {}

  async create(newProps: CounselorsNewProps): Promise<Counselors> {
    return this.counselorPersister.create(newProps);
  }

  async update(counselor: Counselors): Promise<Counselors> {
    return this.counselorPersister.update(counselor);
  }

  async findOne(props: { counselorId: UniqueEntityId }): Promise<Counselors | null> {
    return this.counselorsReader.findOne(props);
  }

  async getOne(props: { counselorId: UniqueEntityId }): Promise<Counselors> {
    const counselor = await this.findOne(props);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }
    return counselor;
  }

  async findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]> {
    return this.counselorsReader.findMany(props);
  }
}
