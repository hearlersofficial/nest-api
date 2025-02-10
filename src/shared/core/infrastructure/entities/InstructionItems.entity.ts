import { Column, Entity, OneToMany } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { InstructionMapsEntity } from "~/src/shared/core/infrastructure/entities/InstructionMaps.entity";

@Entity({
  name: "instruction_items",
})
export class InstructionItemsEntity extends CoreEntity {
  @Column({
    type: "string",
    name: "body",
    comment: "본문",
  })
  body: string;

  @OneToMany(() => InstructionMapsEntity, (instructionMaps) => instructionMaps.instructionItems)
  instructionMaps: InstructionMapsEntity[];
}
