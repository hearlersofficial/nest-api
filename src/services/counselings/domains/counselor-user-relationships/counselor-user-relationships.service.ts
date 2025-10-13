import * as CounselorUserRelationshipsCriteria from "~counselings/domains/counselor-user-relationships/counselor-user-relationship.criteria";
import { CounselorUserRelationshipsReader } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.reader";
import { CounselorUserRelationshipsStore } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.store";
import { CounselorUserRelationshipInfo } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationship-info";
import { CounselorUserRelationshipsNewProps } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";
import { RapportCalculator } from "~counselings/domains/counselor-user-relationships/rapport-calculator";
import { RapportCalcSource } from "~counselings/domains/counselor-user-relationships/types/rapport.type";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselorUserRelationshipsService {
  constructor(
    private readonly reader: CounselorUserRelationshipsReader,
    private readonly store: CounselorUserRelationshipsStore,
    private readonly rapportCalculator: RapportCalculator,
  ) {}

  @Transactional()
  async create(newProps: CounselorUserRelationshipsNewProps): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.store.create(newProps);
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  // 실제 라포 증가 처리
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
    const applyRapportResult = withMessageInteraction
      ? relationship.applyRapportIncreaseWithInteraction({ amount, dailyCap })
      : relationship.applyRapportIncrease({ amount, dailyCap });
    if (applyRapportResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, applyRapportResult.error as string);
    }

    await this.store.update(relationship);
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  // 이벤트 소스에 따른 라포 증가 처리 (계산 + 적용)
  @Transactional()
  async increaseRapportBySource(
    userId: UserId,
    counselorId: CounselorId,
    source: RapportCalcSource,
  ): Promise<CounselorUserRelationshipInfo> {
    const relationship = await this.getOrCreate({ userId, counselorId });

    const calcResult = this.rapportCalculator.compute({
      relation: relationship,
      source,
    });

    if (calcResult.plannedAmount > 0) {
      return this.increaseRapport(
        relationship.id,
        calcResult.plannedAmount,
        this.rapportCalculator.getDailyCap(),
        source.type === "USER_MESSAGE",
      );
    }

    return relationship;
  }

  // 메시지로 인한 라포 증가
  @Transactional()
  async increaseRapportForUserMessage(
    userId: UserId,
    counselorId: CounselorId,
    message: string,
    hasEmotionTag: boolean = false,
  ): Promise<CounselorUserRelationshipInfo> {
    return this.increaseRapportBySource(userId, counselorId, {
      type: "USER_MESSAGE",
      payload: { hasEmotionTag, textLength: message.length },
    });
  }

  // 과제 완료로 인한 라포 증가
  @Transactional()
  async increaseRapportForTaskCompleted(
    userId: UserId,
    counselorId: CounselorId,
    taskKind: string,
  ): Promise<CounselorUserRelationshipInfo> {
    return this.increaseRapportBySource(userId, counselorId, {
      type: "TASK_COMPLETED",
      payload: { taskKind },
    });
  }

  // 세션 틱으로 인한 라포 증가
  @Transactional()
  async increaseRapportForSessionTick(
    userId: UserId,
    counselorId: CounselorId,
    minutesElapsed: number,
  ): Promise<CounselorUserRelationshipInfo> {
    return this.increaseRapportBySource(userId, counselorId, {
      type: "SESSION_TICK",
      payload: { minutesElapsed },
    });
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

  @Transactional()
  async getOrCreate(props: CounselorUserRelationshipsNewProps): Promise<CounselorUserRelationshipInfo> {
    let relationship = await this.reader.findOne({
      uniqueCriteria: { type: "userAndCounselor", userId: props.userId, counselorId: props.counselorId },
    });
    if (!relationship) {
      relationship = await this.store.create(props);
    }
    return CounselorUserRelationshipInfo.fromDomain(relationship);
  }

  async findMany(props: CounselorUserRelationshipsCriteria.FindManyOptions): Promise<CounselorUserRelationshipInfo[]> {
    const relationships = await this.reader.findMany(props);
    return relationships.map((relationship) => CounselorUserRelationshipInfo.fromDomain(relationship));
  }
}
