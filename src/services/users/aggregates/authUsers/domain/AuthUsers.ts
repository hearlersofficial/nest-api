import { Dayjs } from "dayjs";
import { AggregateRoot } from "~/src/shared/core/domain/AggregateRoot";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { Result } from "~/src/shared/core/domain/Result";
import { CoreStatus } from "~/src/shared/core/constants/status.constants";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";
import { AuthChannel } from "~/src/gen/com/hearlers/v1/model/auth_user_pb";
import { Kakao } from "~users/aggregates/authUsers/domain/Kakao";
import { RefreshTokensVO } from "~users/aggregates/authUsers/domain/RefreshTokens.vo";

const REFRESH_TOKEN_NOT_FOUND = "리프레시 토큰을 찾을 수 없습니다.";
const REFRESH_TOKEN_EXPIRED = "리프레시 토큰이 만료되었습니다.";

export interface AuthUsersNewProps {}

export interface AuthUsersProps extends AuthUsersNewProps {
  authChannel: AuthChannel;
  status: CoreStatus;
  userId: number;
  lastLoginAt: Dayjs;
  kakao?: Kakao;
  refreshTokens: RefreshTokensVO[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class AuthUsers extends AggregateRoot<AuthUsersProps> {
  private constructor(props: AuthUsersProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: AuthUsersProps, id: UniqueEntityId): Result<AuthUsers> {
    const authUsers = new AuthUsers(props, id);
    const validationResult = authUsers.validateDomain();
    authUsers.expireRefreshTokens();
    if (validationResult.isFailure) {
      return Result.fail<AuthUsers>(validationResult.error);
    }

    return Result.ok<AuthUsers>(authUsers);
  }

  public static createNew(props: AuthUsersNewProps): Result<AuthUsers> {
    const nowDayjs = getNowDayjs();

    return this.create(
      {
        ...props,
        authChannel: AuthChannel.UNLINKED,
        userId: null,
        status: CoreStatus.INACTIVE,
        lastLoginAt: nowDayjs,
        refreshTokens: [],
        createdAt: nowDayjs,
        updatedAt: nowDayjs,
        deletedAt: null,
      },
      new UniqueEntityId(),
    );
  }

  validateDomain(): Result<void> {
    if (!this.props.authChannel) {
      return Result.fail<void>("인증 채널은 필수입니다.");
    }
    return Result.ok<void>();
  }

  // Getters
  get userId(): number {
    return this.props.userId;
  }

  get authChannel(): AuthChannel {
    return this.props.authChannel;
  }

  get kakao(): Kakao | undefined {
    return this.props.kakao;
  }

  get refreshTokens(): RefreshTokensVO[] {
    return this.props.refreshTokens;
  }

  get lastLoginAt(): Dayjs | null {
    return this.props.lastLoginAt;
  }

  get status(): CoreStatus {
    return this.props.status;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }

  // Methods
  public connectAuthChannel(authChannel: AuthChannel, uniqueId: string): Result<void> {
    if (this.props.authChannel !== AuthChannel.UNLINKED) {
      return Result.fail<void>("인증 채널은 이미 연결되어 있습니다.");
    }
    switch (authChannel) {
      case AuthChannel.KAKAO:
        const kakaoResult: Result<Kakao> = Kakao.createNew({ uniqueId, authUserId: this.id });
        if (kakaoResult.isFailure) {
          return Result.fail<void>(kakaoResult.error);
        }
        this.props.authChannel = authChannel;
        this.props.kakao = kakaoResult.value;
        break;
      default:
        return Result.fail<void>("Invalid auth channel");
    }
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public bindUser(userId: number): void {
    this.props.userId = userId;
    this.props.status = CoreStatus.ACTIVE;
    this.props.updatedAt = getNowDayjs();
  }

  public inactive(): Result<void> {
    this.props.status = CoreStatus.INACTIVE;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public update(props: AuthUsersProps): Result<void> {
    this.props = { ...this.props, ...props };
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public updateLastLoginAt(): void {
    this.props.lastLoginAt = getNowDayjs();
    this.props.updatedAt = getNowDayjs();
  }

  public findRefreshToken(refreshToken: string): Result<RefreshTokensVO> {
    const refreshTokenVO = this.props.refreshTokens.find((token) => token.token === refreshToken);
    if (!refreshTokenVO) {
      return Result.fail<RefreshTokensVO>(REFRESH_TOKEN_NOT_FOUND);
    }
    return Result.ok<RefreshTokensVO>(refreshTokenVO);
  }

  public saveRefreshToken(refreshToken: string, expiresAt: Dayjs): Result<RefreshTokensVO> {
    const refreshTokenVOResult = RefreshTokensVO.create({
      token: refreshToken,
      expiresAt,
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
    });
    if (refreshTokenVOResult.isFailure) {
      return Result.fail<RefreshTokensVO>(refreshTokenVOResult.error);
    }
    const refreshTokenVO = refreshTokenVOResult.value;
    this.props.refreshTokens.push(refreshTokenVO);
    this.expireRefreshTokens();
    this.updateLastLoginAt();
    return Result.ok<RefreshTokensVO>(refreshTokenVO);
  }

  public verifyRefreshToken(refreshToken: string): Result<RefreshTokensVO> {
    const findRefreshTokenResult = this.findRefreshToken(refreshToken);
    if (findRefreshTokenResult.isFailure) {
      return Result.fail<RefreshTokensVO>(findRefreshTokenResult.error);
    }
    const refreshTokenVO = findRefreshTokenResult.value;
    if (refreshTokenVO.isExpired()) {
      return Result.fail<RefreshTokensVO>(REFRESH_TOKEN_EXPIRED);
    }
    this.removeRefreshToken(refreshTokenVO);
    return Result.ok<RefreshTokensVO>(refreshTokenVO);
  }

  private removeRefreshToken(refreshTokenVO: RefreshTokensVO): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => token.token !== refreshTokenVO.token);
  }

  private expireRefreshTokens(): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => !token.isExpired());
  }
}
