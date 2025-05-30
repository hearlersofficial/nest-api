import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

export type UsersCriteriaUniqueKey = { type: "user"; id: UniqueEntityId } | { type: "nickname"; nickname: string };

export type UsersCriteriaFindOne = {
  userId?: UniqueEntityId;
  nickname?: string;
  withPessimisticWriteLock?: boolean;
};

export type UsersCriteriaFindMany = {
  nickname?: string;
};
