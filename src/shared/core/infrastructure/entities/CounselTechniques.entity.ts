import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/Counsels.entity";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Context.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, RelationId } from "typeorm";

@Entity({ name: "counsel_techniques", comment: "상담 기법 (톤 + 컨텍스트 + 지시사항)" })
export class CounselTechniquesEntity extends CoreEntity {
  @Column({
    type: "varchar",
    name: "name",
    comment: "이름",
  })
  name: string;

  @ManyToOne(() => ToneEntity, (tone) => tone.counselTechniques, { nullable: true })
  @JoinColumn({ name: "tone_id" })
  tone: ToneEntity | null;

  @Column({
    type: "enum",
    name: "counsel_technique_stage",
    enum: CounselTechniqueStage,
    comment: "상담 기법 단계",
  })
  counselTechniqueStage: CounselTechniqueStage;

  @ManyToOne(() => ContextEntity, (context) => context.counselTechniques)
  context: ContextEntity;

  @ManyToOne(() => InstructionEntity, (instruction) => instruction.counselTechniques)
  instruction: InstructionEntity;

  // 이전 노드를 가리키는 관계
  @OneToOne(() => CounselTechniquesEntity, { nullable: true })
  prevTechnique: CounselTechniquesEntity;

  // 다음 노드를 가리키는 관계 (소유측)
  @OneToOne(() => CounselTechniquesEntity, (technique) => technique.prevTechnique, { nullable: true })
  @JoinColumn({ name: "next_technique_id" })
  nextTechnique: CounselTechniquesEntity;

  @RelationId((technique: CounselTechniquesEntity) => technique.nextTechnique)
  @Column({
    type: "varchar",
    name: "next_technique_id",
    comment: "다음 노드 ID",
    nullable: true,
  })
  nextTechniqueId: string;

  @OneToMany(() => CounselsEntity, (counsel) => counsel.counselTechnique, {
    cascade: true,
  })
  counsels: CounselsEntity[];
}
