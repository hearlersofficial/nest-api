import { CounselsCriteriaFindMany } from "~counselings/domains/counsels/counsels.criteria";
import { CounselsPersister } from "~counselings/domains/counsels/counsels.persister";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class CounselsService {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsPersister: CounselsPersister,
  ) {}

  async create(newProps: CounselsNewProps): Promise<Counsels> {
    return this.counselsPersister.create(newProps);
  }

  async update(counsel: Counsels): Promise<Counsels> {
    return this.counselsPersister.update(counsel);
  }

  async findOne(props: { counselId: UniqueEntityId }): Promise<Counsels | null> {
    return this.counselsReader.findOne(props);
  }

  async getOne(props: { counselId: UniqueEntityId }): Promise<Counsels> {
    const counsel = await this.findOne(props);
    if (!counsel) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel not found");
    }
    return counsel;
  }

  async findMany(props: CounselsCriteriaFindMany): Promise<Counsels[]> {
    return this.counselsReader.findMany(props);
  }
}
