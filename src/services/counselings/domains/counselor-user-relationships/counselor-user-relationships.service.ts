import * as CounselorUserRelationshipsCriteria from "~counselings/domains/counselor-user-relationships/counselor-user-relationship.criteria";
import { CounselorUserRelationshipsReader } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.reader";
import { CounselorUserRelationshipsStore } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.store";
import { CounselorUserRelationshipInfo } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationship-info";
import { CounselorUserRelationshipsNewProps } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorUserRelationshipsService {
  constructor(
    private readonly reader: CounselorUserRelationshipsReader,
    private readonly store: CounselorUserRelationshipsStore,
  ) {}

  @Transactional()
  async create(newProps: CounselorUserRelationshipsNewProps): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.store.create(newProps);
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  @Transactional()
  async increaseRapport(
    relationshipId: CounselorUserRelationshipId,
    amount: number,
    dailyCap: number,
    withMessageInteraction: boolean = true,
  ): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.reader.findOne({
      uniqueCriteria: { type: "counselorUserRelationship", id: relationshipId },
    });
    if (!relationship) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselorUserRelationship not found");
    }
    withMessageInteraction
      ? relationship.applyRapportIncreaseWithInteraction({ amount, dailyCap })
      : relationship.applyRapportIncrease({ amount, dailyCap });
    await this.store.update(relationship);
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  @Transactional()
  async decreaseRapport(
    relationshipId: CounselorUserRelationshipId,
    amount: number,
  ): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.reader.findOne({
      uniqueCriteria: { type: "counselorUserRelationship", id: relationshipId },
    });
    if (!relationship) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselorUserRelationship not found");
    }
    relationship.decreaseRapport(amount);
    await this.store.update(relationship);
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  async getOne(props: {
    uniqueCriteria: CounselorUserRelationshipsCriteria.UniqueKey;
    options?: CounselorUserRelationshipsCriteria.FindOneOptions;
  }): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.reader.findOne(props);
    if (!relationship) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "CounselorUserRelationship not found");
    }
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  async findMany(props: CounselorUserRelationshipsCriteria.FindManyOptions): Promise<CounselorUserRelationshipInfo[]> {
    const relationships = await this.reader.findMany(props);
    return relationships.map((relationship) => CounselorUserRelationshipInfo.fromDomain(relationship));
  }
}
