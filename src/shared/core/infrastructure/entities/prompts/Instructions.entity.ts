import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";

import { Column, Entity, OneToMany } from "typeorm";
@Entity({
  name: "instructions",
  comment: "지시사항",
})
export class InstructionEntity extends CoreEntity {
  @Column({
    name: "name",
    comment: "이름",
  })
  name: string;

  @Column({
    name: "initial_sentence",
    comment: "초기 문장",
    type: "varchar",
    nullable: true,
  })
  initialSentence: string | null;

  @OneToMany(() => InstructionMapEntity, (instructionMap) => instructionMap.instruction, {
    cascade: true,
  })
  instructionMaps: InstructionMapEntity[];

  @OneToMany(() => CounselTechniquesEntity, (counselTechnique) => counselTechnique.instruction)
  counselTechniques: CounselTechniquesEntity[];
}
