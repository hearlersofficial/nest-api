import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/counselors/Counselors.entity";
import { Counselors } from "~counselings/domains/counselors/models/counselors";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselorsRepository {
  abstract findByCounselorId(counselorId: UniqueEntityId, options?: FindOneOptions<CounselorsEntity>): Promise<Counselors | null>;
  abstract findMany(options?: FindManyOptions<CounselorsEntity>): Promise<Counselors[]>;
  abstract save(counselor: Counselors): Promise<Counselors>;
  abstract save(counselors: Counselors[]): Promise<Counselors[]>;
}
