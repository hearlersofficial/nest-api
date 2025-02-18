import { CoreEntity } from "~shared/core/infrastructure/entities/Core.entity";
import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";

import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@Entity({
  name: "instruction_maps",
  comment: "지시사항 매핑",
})
export class InstructionMapEntity extends CoreEntity {
  @Column({
    type: "int",
    name: "sequence",
    comment: "순서",
  })
  sequence: number;

  @ManyToOne(() => InstructionItemEntity, (instructionItem) => instructionItem.id)
  @JoinColumn({ name: "instruction_item_id" })
  instructionItem: InstructionItemEntity;

  @RelationId((instructionMap: InstructionMapEntity) => instructionMap.instructionItem)
  @Column({
    type: "bigint",
    name: "instruction_item_id",
    comment: "지시사항 항목 ID",
  })
  instructionItemId: string;

  @ManyToOne(() => InstructionEntity, (instruction) => instruction.id)
  @JoinColumn({ name: "instruction_id" })
  instruction: InstructionEntity;

  @RelationId((instructionMap: InstructionMapEntity) => instructionMap.instruction)
  @Column({
    type: "bigint",
    name: "instruction_id",
    comment: "지시사항 ID",
  })
  instructionId: string;
}
