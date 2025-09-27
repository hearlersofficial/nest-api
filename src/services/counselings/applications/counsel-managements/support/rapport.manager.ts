import { RapportCalculator } from "~counselings/applications/counsel-managements/support/rapport-calculator";
import { CounselorUserRelationshipsService } from "~counselings/domains/counselor-user-relationships/counselor-user-relationships.service";

import { Injectable } from "@nestjs/common";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { UserId } from "~common/shared-kernel/identifiers/user.id";

/**
 * 라포 매니저: 상담사-사용자 관계의 라포(친밀도) 관리
 * - 메시지 수신, 과제 완료, 세션 틱 등 이벤트에 따라 라포를 계산하고 반영
 */
@Injectable()
export class RapportManager {
  constructor(
    private readonly counselorUserRelationshipsService: CounselorUserRelationshipsService,
    private readonly rapportCalculator: RapportCalculator,
  ) {}

  async increaseRapportForUserMessage(userId: UserId, counselorId: CounselorId, message: string): Promise<void> {
    const relationship = await this.counselorUserRelationshipsService.getOrCreate({ userId, counselorId });

    const result = this.rapportCalculator.compute({
      relation: relationship,
      eventType: "USER_MESSAGE",
      payload: { hasEmotionTag: false, textLength: message.length },
    });

    await this.counselorUserRelationshipsService.increaseRapport(
      relationship.id,
      result.plannedAmount,
      this.rapportCalculator.getDailyCap(),
      true,
    );
  }
}
