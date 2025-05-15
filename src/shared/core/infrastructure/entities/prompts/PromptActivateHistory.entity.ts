import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";

import { Column, Entity } from "typeorm";

@Entity({ name: "prompt_activate_history", comment: "프롬프트 활성화 이력" })
export class PromptActivateHistoryEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "prompt_version_id",
    comment: "프롬프트 버전 ID",
  })
  promptVersionId: string;

  @Column({
    type: "timestamp",
    name: "activated_at",
    comment: "활성화 시간(한국시간)",
  })
  activatedAt: string;
}
