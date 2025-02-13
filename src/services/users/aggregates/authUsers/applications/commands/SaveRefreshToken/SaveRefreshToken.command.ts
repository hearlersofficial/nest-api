import { Dayjs } from "dayjs";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export class SaveRefreshTokenCommand {
  constructor(public readonly props: SaveRefreshTokenCommandProps) {}
}

interface SaveRefreshTokenCommandProps {
  userId: UniqueEntityId;
  token: string;
  expiresAt: Dayjs;
}

export class SaveRefreshTokenResult {}
