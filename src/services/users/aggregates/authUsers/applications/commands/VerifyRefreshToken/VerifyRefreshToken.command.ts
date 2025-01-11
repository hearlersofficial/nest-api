export class VerifyRefreshTokenCommand {
  constructor(public readonly props: VerifyRefreshTokenCommandProps) {}
}

interface VerifyRefreshTokenCommandProps {
  userId: number;
  token: string;
}

export class VerifyRefreshTokenResult {
  success: boolean;
}
