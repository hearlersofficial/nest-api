import { CoreEntity } from "~common/system/persistences/entities/core.entity";
import { CounselsEntity } from "~common/system/persistences/entities/councels/Counsels.entity";
import { ToneEntity } from "~common/system/persistences/entities/counselors/tone.entity";
import { ToneScopedPromptEntity } from "~common/system/persistences/entities/prompts/ToneScopedPrompts.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";

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
    type: "int",
    name: "message_threshold",
    comment: "전환에 필요한 메시지 수",
  })
  messageThreshold: number;

  @Column({
    type: "boolean",
    name: "is_temporary",
    comment: "임시 여부",
  })
  isTemporary: boolean;

  // 이전 노드를 가리키는 관계
  @OneToOne(() => CounselTechniquesEntity, (technique) => technique.nextTechnique, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  prevTechnique: CounselTechniquesEntity | null;

  // 다음 노드를 가리키는 관계(소유측)
  @OneToOne(() => CounselTechniquesEntity, (technique) => technique.prevTechnique, {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "next_technique_id" })
  nextTechnique: CounselTechniquesEntity | null;

  @RelationId((technique: CounselTechniquesEntity) => technique.nextTechnique)
  @Column({
    type: "bigint",
    name: "next_technique_id",
    comment: "다음 노드 ID",
    nullable: true,
  })
  nextTechniqueId: string | null;

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselTechnique, {
    cascade: true,
  })
  counsels: CounselsEntity[];

  @OneToMany(() => ToneScopedPromptEntity, (toneScopedPrompt) => toneScopedPrompt.firstCounselTechnique, {
    cascade: true,
  })
  toneScopedPrompts: ToneScopedPromptEntity[];
}
