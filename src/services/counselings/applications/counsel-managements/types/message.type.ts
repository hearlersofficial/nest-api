import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type CreateUserMessageParams = {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  message: string;
};

export type CreateSystemMessageParams = {
  counselId: UniqueEntityId;
  userId: UniqueEntityId;
  counselTechniqueId: UniqueEntityId;
  message: string;
};

export type UpdateLastMessageParams = {
  counselId: UniqueEntityId;
  lastMessage: string;
};
