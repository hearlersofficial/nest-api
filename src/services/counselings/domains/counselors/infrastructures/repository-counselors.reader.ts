import { CounselorsCriteriaFindMany } from "~counselings/domains/counselors/counselors.criteria";
import { CounselorsReader } from "~counselings/domains/counselors/counselors.reader";
import { CounselorsRepository } from "~counselings/domains/counselors/infrastructures/counselors.repository";
import { RepositoryCounselorCriteriaMapper } from "~counselings/domains/counselors/infrastructures/mappers/repository-counselors-criteria.mapper";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselorsReader extends CounselorsReader {
  constructor(private readonly counselorsRepository: CounselorsRepository) {
    super();
  }

  override async findOne(props: { counselorId: CounselorId }): Promise<Counselors | null> {
    return this.counselorsRepository.findByCounselorId(props.counselorId);
  }

  override async getOne(props: { counselorId: CounselorId }): Promise<Counselors> {
    const counselor = await this.counselorsRepository.findByCounselorId(props.counselorId);
    if (!counselor) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counselor not found");
    }
    return counselor;
  }

  override async findMany(props: CounselorsCriteriaFindMany): Promise<Counselors[]> {
    const typeormOptions = RepositoryCounselorCriteriaMapper.toFindManyOptions(props);
    return this.counselorsRepository.findMany(typeormOptions);
  }
}
