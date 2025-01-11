import { Dayjs } from "dayjs";

export class SaveRefreshTokenCommand {
  constructor(public readonly props: SaveRefreshTokenCommandProps) {}
}

interface SaveRefreshTokenCommandProps {
  userId: number;
  token: string;
  expiresAt: Dayjs;
}

export class SaveRefreshTokenResult {}
