import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { InstructionMapsEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";

import { Column, Entity, OneToMany } from "typeorm";

@Entity({
  name: "instruction_items",
})
export class InstructionItemsEntity extends CoreEntity {
  @Column({
    name: "body",
    comment: "본문",
  })
  body: string;

  @OneToMany(() => InstructionMapsEntity, (instructionMaps) => instructionMaps.instructionItems)
  instructionMaps: InstructionMapsEntity[];
}
