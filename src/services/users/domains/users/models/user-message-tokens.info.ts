import { UserMessageTokens } from "~users/domains/users/models/user-message-tokens";

import { TokenResetInterval } from "~common/shared/enums/token-reset-interval.enum";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserMessageTokenId } from "~common/shared-kernel/identifiers/user-message-token.id";
import { Dayjs } from "dayjs";

export class UserMessageTokensInfo {
  constructor(
    public readonly id: UserMessageTokenId,
    public readonly userId: UserId,
    public readonly resetInterval: TokenResetInterval,
    public readonly maxTokens: number,
    public readonly remainingTokens: number,
    public readonly lastReset: Dayjs,
    public readonly reserved: boolean,
    public readonly reservedTimeout: Dayjs | null,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(tokens: UserMessageTokens): UserMessageTokensInfo {
    return new UserMessageTokensInfo(
      tokens.id,
      tokens.userId,
      tokens.resetInterval,
      tokens.maxTokens,
      tokens.remainingTokens,
      tokens.lastReset,
      tokens.reserved,
      tokens.reservedTimeout,
      tokens.createdAt,
      tokens.updatedAt,
      tokens.deletedAt,
    );
  }

  static fromDomainArray(tokens: UserMessageTokens[]): UserMessageTokensInfo[] {
    return tokens.map((token) => UserMessageTokensInfo.fromDomain(token));
  }
}
