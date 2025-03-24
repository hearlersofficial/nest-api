import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselsPersister } from "~counselings/domains/counsels/counsels.persister";
import { Counsels, CounselsNewProps } from "~counselings/domains/counsels/models/counsels";
import { CounselsRepository } from "~counselings/infrastructures/counsels/counsels.repository";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class RepositoryCounselsPersister extends CounselsPersister {
  constructor(private readonly counselRepository: CounselsRepository) {
    super();
  }

  override async create(newProps: CounselsNewProps): Promise<Counsels> {
    const counselResult = Counsels.createNew(newProps);
    if (counselResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselResult.error as string);
    }
    return this.counselRepository.save(counselResult.value);
  }

  override async update(counsel: Counsels): Promise<Counsels> {
    return this.counselRepository.save(counsel);
  }

  override async updateMany(counsels: Counsels[]): Promise<Counsels[]> {
    return this.counselRepository.save(counsels);
  }
}
