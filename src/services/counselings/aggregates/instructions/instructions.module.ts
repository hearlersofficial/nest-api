import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { InstructionService } from "~counselings/aggregates/instructions/applications/instruction.service";
import { InstructionPersistor } from "~counselings/aggregates/instructions/applications/tools/instruction.persistor";
import { InstructionReader } from "~counselings/aggregates/instructions/applications/tools/instruction.reader";
import { PsqlInstructionsRepositoryAdaptor } from "~counselings/aggregates/instructions/infrastructures/adaptors/psql.instructions.repository.adaptor";
import { INSTRUCTION_REPOSITORY } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionEntity, InstructionMapEntity])],
  providers: [
    InstructionPersistor,
    InstructionReader,
    InstructionService,
    {
      provide: INSTRUCTION_REPOSITORY,
      useClass: PsqlInstructionsRepositoryAdaptor,
    },
  ],
  exports: [InstructionService],
})
export class InstructionsModule {}
