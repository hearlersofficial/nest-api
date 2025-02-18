import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { GetInstructionItemListUseCase } from "~counselings/aggregates/instructionItems/applications/useCases/GetInstructionItemListUseCase/GetInstructionItemListUseCase";
import { PsqlInstructionItemsRepositoryAdaptor } from "~counselings/aggregates/instructionItems/infrastructures/adaptors/psql.instructionItems.repository.adaptor";
import { INSTRUCTION_ITEM_REPOSITORY } from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [GetInstructionItemListUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([InstructionItemEntity])],
  providers: [
    ...useCases,
    {
      provide: INSTRUCTION_ITEM_REPOSITORY,
      useClass: PsqlInstructionItemsRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class InstructionItemsModule {}
