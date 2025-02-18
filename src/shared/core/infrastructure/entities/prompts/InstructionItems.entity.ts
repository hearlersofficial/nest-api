import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "instruction_items",
  comment: "지시사항 항목",
})
export class InstructionItemEntity extends CoreEntity {
  @Column({
    name: "body",
    comment: "본문",
  })
  body: string;

  @OneToMany(() => InstructionMapEntity, (instructionMap) => instructionMap.instructionItem)
  instructionMaps: InstructionMapEntity[];
}
