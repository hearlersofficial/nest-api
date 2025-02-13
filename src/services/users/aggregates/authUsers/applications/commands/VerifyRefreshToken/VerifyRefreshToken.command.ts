import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";

export class VerifyRefreshTokenCommand {
  constructor(public readonly props: VerifyRefreshTokenCommandProps) {}
}

interface VerifyRefreshTokenCommandProps {
  userId: UniqueEntityId;
  token: string;
}

export class VerifyRefreshTokenResult {
  success: boolean;
}
