import {
  CounselorUserRelationships,
  CounselorUserRelationshipsNewProps,
} from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class CounselorUserRelationshipsStore {
  abstract create(newProps: CounselorUserRelationshipsNewProps): Promise<CounselorUserRelationships>;
  abstract update(counselorUserRelationship: CounselorUserRelationships): Promise<CounselorUserRelationships>;
  abstract updateMany(counselorUserRelationships: CounselorUserRelationships[]): Promise<CounselorUserRelationships[]>;
}
