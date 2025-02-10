import { Column, ManyToOne, OneToOne, JoinColumn, RelationId, OneToMany } from "typeorm";
import { CounselTechniqueStage, CounselTone } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { ContextEntity } from "~/src/shared/core/infrastructure/entities/Context.entity";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { CounselsEntity } from "~/src/shared/core/infrastructure/entities/Counsels.entity";
import { InstructionEntity } from "~/src/shared/core/infrastructure/entities/Instructions.entity";
import { ToneEntity } from "~/src/shared/core/infrastructure/entities/Tones.entity";

export class CounselTechniquesEntity extends CoreEntity {
  @Column({
    type: "varchar", // string 대신 varchar를 사용합니다.
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
