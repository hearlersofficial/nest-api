import { CounselorUserRelationshipsStore } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.store";
import { CounselorUserRelationshipsRepository } from "~counselings/domains/counselor-user-relationships/infrastructures/counselor-user-relationships.repository";
import {
  CounselorUserRelationships,
  CounselorUserRelationshipsNewProps,
} from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCounselorUserRelationshipsStore extends CounselorUserRelationshipsStore {
  constructor(private readonly counselorUserRelationshipsRepository: CounselorUserRelationshipsRepository) {
    super();
  }

  override async create(newProps: CounselorUserRelationshipsNewProps): Promise<CounselorUserRelationships> {
    const relationshipResult = CounselorUserRelationships.createNew(newProps);
    if (relationshipResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, relationshipResult.error as string);
    }
    return this.counselorUserRelationshipsRepository.save(relationshipResult.value);
  }

  override async update(relationship: CounselorUserRelationships): Promise<CounselorUserRelationships> {
    return this.counselorUserRelationshipsRepository.save(relationship);
  }

  override async updateMany(relationships: CounselorUserRelationships[]): Promise<CounselorUserRelationships[]> {
    return this.counselorUserRelationshipsRepository.save(relationships);
  }
}
