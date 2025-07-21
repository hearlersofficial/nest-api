import { getNowDayjs } from "~common/shared/utils/date";
import { DomainEntity } from "~common/shared-kernel/domains/domain-entity";
import { Result } from "~common/shared-kernel/domains/results";
import { RefreshTokenId } from "~common/shared-kernel/identifiers/refresh-token.id";
import { Dayjs } from "dayjs";

export interface RefreshTokenNewProps {
  token: string;
  expiresAt: Dayjs;
}

export interface RefreshTokensProps extends RefreshTokenNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class RefreshTokens extends DomainEntity<RefreshTokensProps, RefreshTokenId> {
  protected props: RefreshTokensProps;

  private constructor(props: RefreshTokensProps, id: RefreshTokenId) {
    super(props, id);
  }

  public static create(props: RefreshTokensProps, id: RefreshTokenId): Result<RefreshTokens> {
    const refreshTokens = new RefreshTokens(props, id);
    const validateResult = refreshTokens.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail(validateResult.error as string);
    }
    return Result.ok(refreshTokens);
  }

  public static createNew(props: RefreshTokenNewProps): Result<RefreshTokens> {
    return this.create(
      { ...props, createdAt: getNowDayjs(), updatedAt: getNowDayjs(), deletedAt: null },
      new RefreshTokenId(),
    );
  }

  public validateDomain(): Result<RefreshTokens> {
    return Result.ok<RefreshTokens>(this);
  }

  public get token(): string {
    return this.props.token;
  }

  public get expiresAt(): Dayjs {
    return this.props.expiresAt;
  }

  public get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  public get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  public isExpired(): boolean {
    return this.props.expiresAt.isBefore(getNowDayjs());
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }
}
