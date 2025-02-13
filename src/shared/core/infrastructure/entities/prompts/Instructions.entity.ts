import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { InstructionMapsEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";

import { Column, Entity, OneToMany } from "typeorm";
@Entity({
  name: "instruction",
})
export class InstructionEntity extends CoreEntity {
  @OneToMany(() => InstructionMapsEntity, (instructionMaps) => instructionMaps.instruction)
  instructionMaps: InstructionMapsEntity[];

  @Column({
    name: "initial_sentence",
    comment: "초기 문장",
    nullable: true,
  })
  initialSentence: string | null;

  @OneToMany(() => CounselTechniquesEntity, (counselTechniques) => counselTechniques.instruction)
  counselTechniques: CounselTechniquesEntity[];
}
