import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { InstructionItemPersistor } from "~counselings/aggregates/instructionItems/applications/tools/instructionItem.persistor";
import { InstructionItemReader } from "~counselings/aggregates/instructionItems/applications/tools/instructionItem.reader";
import { PsqlInstructionItemsRepositoryAdaptor } from "~counselings/aggregates/instructionItems/infrastructures/adaptors/psql.instructionItems.repository.adaptor";
import { INSTRUCTION_ITEM_REPOSITORY } from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionItemEntity])],
  providers: [
    InstructionItemPersistor,
    InstructionItemReader,
    InstructionItemService,
    {
      provide: INSTRUCTION_ITEM_REPOSITORY,
      useClass: PsqlInstructionItemsRepositoryAdaptor,
    },
  ],
  exports: [InstructionItemService],
})
export class InstructionItemsModule {}
