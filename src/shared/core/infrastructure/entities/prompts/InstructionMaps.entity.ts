import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { InstructionItemsEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";

import { Column, Entity, ManyToOne } from "typeorm";

@Entity({ name: "instruction_maps", comment: "지시사항 맵핑" })
export class InstructionMapsEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "sequence",
    comment: "순서",
  })
  sequence: number;

  @ManyToOne(() => InstructionItemsEntity, (instructionItems) => instructionItems.id)
  instructionItems: InstructionItemsEntity;

  @ManyToOne(() => InstructionEntity, (instruction) => instruction.id)
  instruction: InstructionEntity;
}
