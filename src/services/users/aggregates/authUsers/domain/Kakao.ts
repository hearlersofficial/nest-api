import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { Result } from "~/src/shared/core/domain/Result";
import { Dayjs } from "dayjs";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";
import { DomainEntity } from "~/src/shared/core/domain/DomainEntity";

interface KakaoNewProps {
  authUserId: UniqueEntityId;
  uniqueId: string;
}

interface KakaoProps extends KakaoNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class Kakao extends DomainEntity<KakaoProps> {
  private constructor(props: KakaoProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: KakaoProps, id: UniqueEntityId): Result<Kakao> {
    const kakao = new Kakao(props, id);
    const validateResult = kakao.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<Kakao>(validateResult.error);
    }
    return Result.ok<Kakao>(kakao);
  }

  public static createNew(newProps: KakaoNewProps): Result<Kakao> {
    const now = getNowDayjs();
    return this.create({ ...newProps, createdAt: now, updatedAt: now, deletedAt: null }, new UniqueEntityId());
  }

  validateDomain(): Result<void> {
    // authUserId 검증
    if (!this.props.authUserId) {
      return Result.fail<void>("[Kakao] 사용자 ID는 필수입니다");
    }

    // uniqueId 검증
    if (!this.props.uniqueId) {
      return Result.fail<void>("[Kakao] Kakao 고유 ID는 필수입니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[Kakao] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[Kakao] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get authUserId(): UniqueEntityId {
    return this.props.authUserId;
  }

  get uniqueId(): string {
    return this.props.uniqueId;
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
  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
