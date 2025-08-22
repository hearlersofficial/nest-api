import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselsRepository {
  abstract findByCounselId(counselId: CounselId, options?: FindOneOptions<CounselsEntity>): Promise<Counsels | null>;
  abstract findMany(options?: FindManyOptions<CounselsEntity>): Promise<Counsels[]>;
  abstract save(counsel: Counsels): Promise<Counsels>;
  abstract save(counsels: Counsels[]): Promise<Counsels[]>;
}
