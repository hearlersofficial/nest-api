import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { PromptVersionEntity } from "~common/system/persistences/entities/prompts/prompt-versions.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

@Entity({ name: "counsel_techniques", comment: "상담 기법 (톤 + 컨텍스트 + 지시사항)" })
export class CounselTechniquesEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "이름",
  })
  name: string;

  @Column({
    type: "float",
    name: "temperature",
    comment: "온도",
    default: 0.5,
  })
  temperature: number;

  @ManyToOne(() => ToneEntity, (tone) => tone.counselTechniques)
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity;

  @RelationId((technique: CounselTechniquesEntity) => technique.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
  })
  toneId: string;

  @Column({
    type: "text",
    name: "context",
    comment: "컨텍스트",
  })
  context: string;

  @Column({
    type: "text",
    name: "instruction",
    comment: "지시사항",
  })
  instruction: string;

  @Column({
    type: "boolean",
    name: "is_start_technique",
    comment: "시작 기법 여부 (톤 별 1개만 시작 기법으로 설정 가능)",
  })
  isStartTechnique: boolean;

  @ManyToOne(() => PromptVersionEntity, (promptVersion) => promptVersion.counselTechniques, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "prompt_version_id" })
  promptVersion: PromptVersionEntity;

  @RelationId((technique: CounselTechniquesEntity) => technique.promptVersion)
  @Column({ type: "bigint", name: "prompt_version_id" })
  promptVersionId: string;

  @OneToMany(() => CounselContextsEntity, (counselContext) => counselContext.counselTechnique, {
    cascade: true,
  })
  counselContexts: CounselContextsEntity[];

  @OneToMany(() => CounselTechniqueTransitionRuleEntity, (rule) => rule.fromCounselTechnique, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  fromTransitionRules: CounselTechniqueTransitionRuleEntity[];

  @OneToMany(() => CounselTechniqueTransitionRuleEntity, (rule) => rule.toCounselTechnique, {
    cascade: true,
    orphanedRowAction: "disable",
  })
  toTransitionRules: CounselTechniqueTransitionRuleEntity[];
}
