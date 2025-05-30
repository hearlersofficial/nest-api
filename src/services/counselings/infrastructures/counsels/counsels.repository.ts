import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselsRepository {
  abstract findByCounselId(
    counselId: UniqueEntityId,
    options?: FindOneOptions<CounselsEntity>,
  ): Promise<Counsels | null>;
  abstract findMany(options?: FindManyOptions<CounselsEntity>): Promise<Counsels[]>;
  abstract save(counsel: Counsels): Promise<Counsels>;
  abstract save(counsels: Counsels[]): Promise<Counsels[]>;
}
