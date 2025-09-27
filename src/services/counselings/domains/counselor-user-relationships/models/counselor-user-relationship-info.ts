import { CounselorUserRelationships } from "~counselings/domains/counselor-user-relationships/models/counselor-user-relationships";

import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { CounselorUserRelationshipId } from "~common/shared-kernel/identifiers/counselor-user-relationship.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { Dayjs } from "dayjs";

/**
 * 외부 노출용 상담사-사용자 관계 정보 클래스
 */
export class CounselorUserRelationshipInfo {
  constructor(
    public readonly id: CounselorUserRelationshipId,
    public readonly userId: UserId,
    public readonly counselorId: CounselorId,
    public readonly rapport: number,
    public readonly totalUserMessageCount: number,
    public readonly lastInteractionAt: Dayjs | null,
    public readonly dailyIncreasedRapport: number,
    public readonly dailyRapportResetAt: Dayjs | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(relationship: CounselorUserRelationships): CounselorUserRelationshipInfo {
    return new CounselorUserRelationshipInfo(
      relationship.id,
      relationship.userId,
      relationship.counselorId,
      relationship.rapport,
      relationship.totalUserMessageCount,
      relationship.lastInteractionAt,
      relationship.dailyIncreasedRapport,
      relationship.dailyRapportResetAt,
      relationship.createdAt,
      relationship.updatedAt,
      relationship.deletedAt,
    );
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(relationships: CounselorUserRelationships[]): CounselorUserRelationshipInfo[] {
    return relationships.map((relationship) => CounselorUserRelationshipInfo.fromDomain(relationship));
  }
}
