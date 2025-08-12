import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/Counsels.entity";
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
