import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/PromptVersions.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({ name: "prompt_activate_history", comment: "프롬프트 활성화 이력" })
export class PromptActivateHistoryEntity extends CoreEntity {
  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.promptActivateHistories, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((promptActivateHistory: PromptActivateHistoryEntity) => promptActivateHistory.promptVersion)
  @Column({
    type: "bigint",
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
