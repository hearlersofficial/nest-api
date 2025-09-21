import { CounselorUserRelationships } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { CounselorUserRelationshipsEntity } from "~common/system/persistences/entities/counsels/counselor-user-relationships.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CounselorUserRelationshipsRepository {
  abstract findByRelationshipId(
    relationshipId: CounselorUserRelationshipId,
    options?: FindOneOptions<CounselorUserRelationshipsEntity>,
  ): Promise<CounselorUserRelationships | null>;
  abstract findByUserAndCounselorId(
    userId: UserId,
    counselorId: CounselorId,
    options?: FindOneOptions<CounselorUserRelationshipsEntity>,
  ): Promise<CounselorUserRelationships | null>;
  abstract findMany(options?: FindManyOptions<CounselorUserRelationshipsEntity>): Promise<CounselorUserRelationships[]>;
  abstract save(relationship: CounselorUserRelationships): Promise<CounselorUserRelationships>;
  abstract save(relationships: CounselorUserRelationships[]): Promise<CounselorUserRelationships[]>;
}
