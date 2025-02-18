import { InstructionMapEntity } from "~shared/core/infrastructure/entities/prompts/InstructionMaps.entity";
import { InstructionEntity } from "~shared/core/infrastructure/entities/prompts/Instructions.entity";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([InstructionEntity, InstructionMapEntity])],
  providers: [],
  exports: [],
})
export class InstructionsModule {}
