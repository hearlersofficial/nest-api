import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

export type InstructionItemsCriteriaFindMany = {
  keyword?: string;
  ids?: UniqueEntityId[];
};
