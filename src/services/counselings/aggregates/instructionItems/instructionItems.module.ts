import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { PsqlInstructionItemsRepositoryAdaptor } from "~counselings/aggregates/instructionItems/infrastructures/adaptors/psql.instructionItems.repository.adaptor";
import { INSTRUCTION_ITEMS_REPOSITORY } from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionItemEntity])],
  providers: [
    {
      provide: INSTRUCTION_ITEMS_REPOSITORY,
      useClass: PsqlInstructionItemsRepositoryAdaptor,
    },
  ],
  exports: [],
})
export class InstructionItemsModule {}
