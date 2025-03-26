import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { InstructionsPersister } from "~counselings/domains/instructions/instructions.persister";
import { InstructionsReader } from "~counselings/domains/instructions/instructions.reader";
import { InstructionsService } from "~counselings/domains/instructions/instructions.service";
import { InstructionsRepository } from "~counselings/infrastructures/instructions/instructions.repository";
import { PsqlInstructionsRepository } from "~counselings/infrastructures/instructions/psql-instructions.repository";
import { RepositoryInstructionsPersister } from "~counselings/infrastructures/instructions/repository-instructions.persister";
import { RepositoryInstructionsReader } from "~counselings/infrastructures/instructions/repository-instructions.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionEntity, InstructionMapEntity])],
  providers: [
    InstructionsService,
    {
      provide: InstructionsRepository,
      useClass: PsqlInstructionsRepository,
    },
    {
      provide: InstructionsReader,
      useClass: RepositoryInstructionsReader,
    },
    {
      provide: InstructionsPersister,
      useClass: RepositoryInstructionsPersister,
    },
  ],
  exports: [InstructionsService],
})
export class InstructionsModule {}
