import { Column, Entity, ManyToOne } from "typeorm";
import { CoreEntity } from "~/src/shared/core/infrastructure/entities/Core.entity";
import { InstructionEntity } from "~/src/shared/core/infrastructure/entities/prompts/Instructions.entity";
import { InstructionItemsEntity } from "~/src/shared/core/infrastructure/entities/prompts/InstructionItems.entity";

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
