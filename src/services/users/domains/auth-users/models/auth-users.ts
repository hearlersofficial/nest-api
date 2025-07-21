import { Kakao } from "~users/domains/auth-users/models/kakao";
import { RefreshTokens } from "~users/domains/auth-users/models/refresh-tokens";
import { AuthChannel, Authority } from "~proto/com/hearlers/v1/model/auth_user_pb";

import { CoreStatus } from "~common/shared/enums/status";
import { getNowDayjs } from "~common/shared/utils/date";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

const REFRESH_TOKEN_NOT_FOUND = "리프레시 토큰을 찾을 수 없습니다.";
const REFRESH_TOKEN_EXPIRED = "리프레시 토큰이 만료되었습니다.";

export interface AuthUsersNewProps {}

export interface AuthUsersProps extends AuthUsersNewProps {
  authChannel: AuthChannel;
  status: CoreStatus;
  authority: Authority;
  userId: UniqueEntityId | null;
  lastLoginAt: Dayjs;
  kakao: Kakao | null;
  refreshTokens: RefreshTokens[];
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
      return Result.fail<AuthUsers>(validationResult.error as string);
    }

    return Result.ok<AuthUsers>(authUsers);
  }

  public static createNew(props: AuthUsersNewProps): Result<AuthUsers> {
    const nowDayjs = getNowDayjs();

    return this.create(
      {
        ...props,
        authChannel: AuthChannel.UNLINKED,
        authority: Authority.USER,
        userId: null,
        status: CoreStatus.INACTIVE,
        lastLoginAt: nowDayjs,
        refreshTokens: [],
        createdAt: nowDayjs,
        updatedAt: nowDayjs,
        deletedAt: null,
        kakao: null,
      },
      new UniqueEntityId(),
    );
  }

  validateDomain(): Result<void> {
    if (!this.props.authChannel) {
      return Result.fail<void>("인증 채널은 필수입니다.");
    }
    return Result.ok();
  }

  // Getters
  get userId(): UniqueEntityId | null {
    return this.props.userId;
  }

  get authChannel(): AuthChannel {
    return this.props.authChannel;
  }

  get authority(): Authority {
    return this.props.authority;
  }

  get kakao(): Kakao | null {
    return this.props.kakao;
  }

  get refreshTokens(): RefreshTokens[] {
    return this.props.refreshTokens;
  }

  get lastLoginAt(): Dayjs {
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
          return Result.fail<void>(kakaoResult.error as string);
        }
        this.props.authChannel = authChannel;
        this.props.kakao = kakaoResult.value;
        break;
      default:
        return Result.fail<void>("Invalid auth channel");
    }
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public bindUser(userId: UniqueEntityId): void {
    this.props.userId = userId;
    this.props.status = CoreStatus.ACTIVE;
    this.props.updatedAt = getNowDayjs();
  }

  public inactive(): Result<void> {
    this.props.status = CoreStatus.INACTIVE;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public update(props: Partial<AuthUsersProps>): Result<void> {
    this.props = { ...this.props, ...props };
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public updateLastLoginAt(): void {
    this.props.lastLoginAt = getNowDayjs();
    this.props.updatedAt = getNowDayjs();
  }

  public findRefreshToken(refreshToken: string): Result<RefreshTokens> {
    const refreshTokenVO = this.props.refreshTokens.find((token) => token.token === refreshToken);
    if (!refreshTokenVO) {
      return Result.fail<RefreshTokens>(REFRESH_TOKEN_NOT_FOUND);
    }
    return Result.ok<RefreshTokens>(refreshTokenVO);
  }

  public saveRefreshToken(refreshToken: string, expiresAt: Dayjs): Result<RefreshTokens> {
    const refreshTokenVOResult = RefreshTokens.createNew({
      token: refreshToken,
      expiresAt,
    });
    if (refreshTokenVOResult.isFailure) {
      return Result.fail<RefreshTokens>(refreshTokenVOResult.error as string);
    }
    const refreshTokenVO = refreshTokenVOResult.value;
    this.props.refreshTokens.push(refreshTokenVO);
    this.expireRefreshTokens();
    this.updateLastLoginAt();
    return Result.ok<RefreshTokens>(refreshTokenVO);
  }

  public verifyRefreshToken(rawToken: string): Result<RefreshTokens> {
    const findRefreshTokenResult = this.findRefreshToken(rawToken);
    if (findRefreshTokenResult.isFailure) {
      return Result.fail<RefreshTokens>(findRefreshTokenResult.error as string);
    }
    const refreshToken = findRefreshTokenResult.value;
    if (refreshToken.isExpired()) {
      return Result.fail<RefreshTokens>(REFRESH_TOKEN_EXPIRED);
    }
    this.removeRefreshToken(refreshToken);
    return Result.ok<RefreshTokens>(refreshToken);
  }

  private removeRefreshToken(refreshTokenVO: RefreshTokens): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => token.token !== refreshTokenVO.token);
  }

  private expireRefreshTokens(): void {
    this.props.refreshTokens = this.props.refreshTokens.filter((token) => !token.isExpired());
  }
}
