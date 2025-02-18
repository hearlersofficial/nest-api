import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";
import { GetInstructionUseCase } from "~counselings/aggregates/instructions/applications/useCases/GetInstructionUseCase/GetInstructionUseCase";
import { PsqlInstructionsRepositoryAdaptor } from "~counselings/aggregates/instructions/infrastructures/adaptors/psql.instructions.repository.adaptor";
import { INSTRUCTION_REPOSITORY } from "~counselings/aggregates/instructions/infrastructures/instructions.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [GetInstructionUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([InstructionEntity])],
  providers: [
    ...useCases,
    {
      provide: INSTRUCTION_REPOSITORY,
      useClass: PsqlInstructionsRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class InstructionsModule {}
