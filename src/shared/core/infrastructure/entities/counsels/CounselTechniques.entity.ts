import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { ContextEntity } from "~shared/core/infrastructure/entities/prompts/Contexts.entity";
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

  @RelationId((technique: CounselTechniquesEntity) => technique.tone)
  @Column({
    type: "bigint",
    name: "tone_id",
    comment: "톤 ID",
    nullable: true,
  })
  toneId: string | null;

  @ManyToOne(() => ContextEntity, (context) => context.counselTechniques)
  @JoinColumn({ name: "context_id" })
  context: ContextEntity;

  @RelationId((technique: CounselTechniquesEntity) => technique.context)
  @Column({
    type: "bigint",
    name: "context_id",
    comment: "컨텍스트 ID",
  })
  contextId: string;

  @ManyToOne(() => InstructionEntity, (instruction) => instruction.counselTechniques)
  @JoinColumn({ name: "instruction_id" })
  instruction: InstructionEntity;

  @RelationId((technique: CounselTechniquesEntity) => technique.instruction)
  @Column({
    type: "bigint",
    name: "instruction_id",
    comment: "지시사항 ID",
  })
  instructionId: string;

  @Column({
    type: "enum",
    name: "counsel_technique_stage",
    enum: CounselTechniqueStage,
    comment: "상담 기법 단계",
  })
  counselTechniqueStage: CounselTechniqueStage;

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
