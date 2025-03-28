import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_techniques", comment: "상담 기법 (톤 + 컨텍스트 + 지시사항)" })
export class CounselTechniquesEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "이름",
  })
  name: string;

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

  // 이전 노드를 가리키는 관계
  @OneToOne(() => CounselTechniquesEntity, (technique) => technique.nextTechnique, { nullable: true })
  @JoinColumn({ name: "prev_technique_id" })
  prevTechnique: CounselTechniquesEntity | null;

  @RelationId((technique: CounselTechniquesEntity) => technique.prevTechnique)
  @Column({
    type: "bigint",
    name: "prev_technique_id",
    comment: "이전 노드 ID",
    nullable: true,
  })
  prevTechniqueId: string | null;

  // 다음 노드를 가리키는 관계
  @OneToOne(() => CounselTechniquesEntity, (technique) => technique.prevTechnique, { nullable: true })
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
}
