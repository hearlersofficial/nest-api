import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

import { Dayjs } from "dayjs";

export class SaveRefreshTokenCommand {
  constructor(public readonly props: SaveRefreshTokenCommandProps) {}
}

interface SaveRefreshTokenCommandProps {
  userId: UniqueEntityId;
  token: string;
  expiresAt: Dayjs;
}

export class SaveRefreshTokenResult {}
