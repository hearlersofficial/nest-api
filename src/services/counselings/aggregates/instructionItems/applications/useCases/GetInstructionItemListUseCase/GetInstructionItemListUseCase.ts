import { UseCase } from "~shared/core/applications/UseCase";
import { GetInstructionItemListRequest } from "~counselings/aggregates/instructionItems/applications/useCases/GetInstructionItemListUseCase/dto/GetInstructionItemList.request";
import { GetInstructionItemListResponse } from "~counselings/aggregates/instructionItems/applications/useCases/GetInstructionItemListUseCase/dto/GetInstructionItemList.response";
import {
  INSTRUCTION_ITEM_REPOSITORY,
  InstructionItemsRepositoryPort,
} from "~counselings/aggregates/instructionItems/infrastructures/instructionItems.repository.port";

import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetInstructionItemListUseCase implements UseCase<GetInstructionItemListRequest, GetInstructionItemListResponse> {
  constructor(
    @Inject(INSTRUCTION_ITEM_REPOSITORY)
    private readonly instructionItemsRepository: InstructionItemsRepositoryPort,
  ) {}

  async execute(request: GetInstructionItemListRequest): Promise<GetInstructionItemListResponse> {
    const { instructionItemIds } = request;
    const instructionItems = await this.instructionItemsRepository.findMany({ instructionItemIds });
    return {
      ok: true,
      instructionItemList: instructionItems,
    };
  }
}
