import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { CreateInstructionItemHandler } from "~counselings/aggregates/instructionItems/applications/commands/CreateInstructionItem/CreateInstructionItem.handler";
import { UpdateInstructionItemHandler } from "~counselings/aggregates/instructionItems/applications/commands/UpdateInstructionItem/UpdateInstructionItem.handler";
import { InstructionItemService } from "~counselings/aggregates/instructionItems/applications/instructionItem.service";
import { FindInstructionItemByIdHandler } from "~counselings/aggregates/instructionItems/applications/queries/FindInstructionItemById/FindInstructionItemById.handler";
import { FindInstructionItemsHandler } from "~counselings/aggregates/instructionItems/applications/queries/FindInstructionItems/FindInstructionItems.handler";
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
    CreateInstructionItemHandler,
    UpdateInstructionItemHandler,
    FindInstructionItemByIdHandler,
    FindInstructionItemsHandler,
    {
      provide: INSTRUCTION_ITEM_REPOSITORY,
      useClass: PsqlInstructionItemsRepositoryAdaptor,
    },
  ],
  exports: [InstructionItemService],
})
export class InstructionItemsModule {}
