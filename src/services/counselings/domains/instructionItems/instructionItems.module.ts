import { InstructionItemEntity } from "~shared/core/infrastructure/entities/prompts/InstructionItems.entity";
import { InstructionItemsPersister } from "~counselings/domains/instructionItems/instructionItems.persister";
import { InstructionItemsReader } from "~counselings/domains/instructionItems/instructionItems.reader";
import { InstructionItemsService } from "~counselings/domains/instructionItems/instructionItems.service";
import { InstructionItemsRepository } from "~counselings/infrastructures/instructionItems/instructionItems.repository";
import { PsqlInstructionItemsRepository } from "~counselings/infrastructures/instructionItems/psql-instructionItems.repository";
import { RepositoryInstructionItemsPersister } from "~counselings/infrastructures/instructionItems/repository-instructionItems.persister";
import { RepositoryInstructionItemsReader } from "~counselings/infrastructures/instructionItems/repository-instructionItems.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionItemEntity])],
  providers: [
    InstructionItemsService,
    {
      provide: InstructionItemsRepository,
      useClass: PsqlInstructionItemsRepository,
    },
    {
      provide: InstructionItemsReader,
      useClass: RepositoryInstructionItemsReader,
    },
    {
      provide: InstructionItemsPersister,
      useClass: RepositoryInstructionItemsPersister,
    },
  ],
  exports: [InstructionItemsService],
})
export class InstructionItemsModule {}
