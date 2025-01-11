import { Dayjs } from "dayjs";
import { Result } from "~/src/shared/core/domain/Result";
import { ValueObject } from "~/src/shared/core/domain/ValueObject";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";

export interface RefreshTokensProps {
  token: string;
  expiresAt: Dayjs;
  createdAt: Dayjs;
  updatedAt: Dayjs;
}

export class RefreshTokensVO extends ValueObject<RefreshTokensProps> {
  protected props: RefreshTokensProps;

  private constructor(props: RefreshTokensProps) {
    super(props);
  }

  public static create(props: RefreshTokensProps): Result<RefreshTokensVO> {
    return Result.ok(new RefreshTokensVO(props));
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
}
