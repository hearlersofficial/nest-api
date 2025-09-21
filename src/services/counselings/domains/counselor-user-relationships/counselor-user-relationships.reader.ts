import * as CounselorUserRelationshipsCriteria from "~counselings/domains/counselor-user-relationships/counselor-user-relationship.criteria";
import { CounselorUserRelationships } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselorUserRelationshipsReader {
  abstract findOne(props: {
    uniqueCriteria: CounselorUserRelationshipsCriteria.UniqueKey;
    options?: CounselorUserRelationshipsCriteria.FindOneOptions;
  }): Promise<CounselorUserRelationships | null>;
  abstract findMany(props: CounselorUserRelationshipsCriteria.FindManyOptions): Promise<CounselorUserRelationships[]>;
}
