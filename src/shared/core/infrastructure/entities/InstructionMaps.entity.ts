import { Column, ManyToOne } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { InstructionEntity } from "~/src/shared/core/infrastructure/entities/Instructions.entity";
import { InstructionItemsEntity } from "~/src/shared/core/infrastructure/entities/InstructionItems.entity";

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
