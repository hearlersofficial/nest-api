import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselorsRepository {
  abstract findByCounselorId(
    counselorId: UniqueEntityId,
    options?: FindOneOptions<CounselorEntity>,
  ): Promise<Counselors | null>;
  abstract findMany(options?: FindManyOptions<CounselorEntity>): Promise<Counselors[]>;
  abstract save(counselor: Counselors): Promise<Counselors>;
  abstract save(counselors: Counselors[]): Promise<Counselors[]>;
}
