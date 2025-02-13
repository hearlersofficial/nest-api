import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { InstructionMapsEntity } from "~/src/shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { CounselTechniquesEntity } from "~/src/shared/core/infrastructure/entities/CounselTechniques.entity";
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
