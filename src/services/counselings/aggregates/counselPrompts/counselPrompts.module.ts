import { CounselPromptsEntity } from "~/src/shared/core/infrastructure/entities/CounselPrompts.entity";
import { CreatePromptHandler } from "~counselings/aggregates/counselPrompts/applications/commands/CreatePrompt/CreatePrompt.handler";
import { UpdatePromptHandler } from "~counselings/aggregates/counselPrompts/applications/commands/UpdatePrompt/UpdatePrompt.handler";
import { GetPromptListHandler } from "~counselings/aggregates/counselPrompts/applications/queries/GetPromptList/GetPromptList.handler";
import { CreateCounselPromptUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/CreateCounselPromptUseCase/CreateCounselPromptUseCase";
import { GetCounselPromptByIdUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByIdUseCase/GetCounselPromptByIdUseCase";
import { GetCounselPromptByTypeUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptByTypeUseCase/GetCounselPromptByTypeUseCase";
import { GetCounselPromptListUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/GetCounselPromptListUseCase/GetCounselPromptListUseCase";
import { UpdateCounselPromptUseCase } from "~counselings/aggregates/counselPrompts/applications/useCases/UpdateCounselPromptUseCase/UpdateCounselPromptUseCase";
import { PsqlCounselPromptsRepositoryAdaptor } from "~counselings/aggregates/counselPrompts/infrastructures/adaptors/psql.counselPrompts.repository.adaptor";
import { COUNSEL_PROMPT_REPOSITORY } from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

const useCases = [
  GetCounselPromptByIdUseCase,
  GetCounselPromptByTypeUseCase,
  GetCounselPromptListUseCase,
  CreateCounselPromptUseCase,
  UpdateCounselPromptUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([CounselPromptsEntity])],
  providers: [
    ...useCases,
    GetPromptListHandler,
    CreatePromptHandler,
    UpdatePromptHandler,
    {
      provide: COUNSEL_PROMPT_REPOSITORY,
      useClass: PsqlCounselPromptsRepositoryAdaptor,
    },
  ],
  exports: [...useCases],
})
export class CounselPromptsModule {}
