import { UserId } from "~common/shared-kernel/identifiers/user.id";

export type UsersCriteriaUniqueKey = { type: "user"; id: UserId } | { type: "nickname"; nickname: string };

export type UsersCriteriaFindOne = {
  userId?: UserId;
  nickname?: string;
  // NOTE: 내부 로직에 대한 flag를 전달하는 것은 제어결합도를 높이는 방법이므로 좋지 않음 리팩토링 필요
  withPessimisticWriteLock?: boolean;
};

export type UsersCriteriaFindMany = {
  nickname?: string;
};
