import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { Gender, Mbti } from "~proto/com/hearlers/v1/model/user_pb";

import { Dayjs } from "dayjs";

interface UserProfilesNewProps {
  userId: UniqueEntityId;
  profileImage: string;
  phoneNumber: string;
  gender: Gender;
  mbti: Mbti;
  birthday: Dayjs;
  introduction: string;
}

export interface UserProfilesProps extends UserProfilesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserProfiles extends DomainEntity<UserProfilesProps> {
  private constructor(props: UserProfilesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserProfilesProps, id: UniqueEntityId): Result<UserProfiles> {
    const userProfiles = new UserProfiles(props, id);
    const validateResult = userProfiles.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserProfiles>(validateResult.error as string);
    }
    return Result.ok<UserProfiles>(userProfiles);
  }

  public static createNew(newProps: UserProfilesNewProps): Result<UserProfiles> {
    const now = getNowDayjs();
    return this.create({ ...newProps, createdAt: now, updatedAt: now, deletedAt: null }, new UniqueEntityId());
  }

  validateDomain(): Result<void> {
    // userId 검증
    if (!this.props.userId) {
      return Result.fail<void>("[UserProfiles] 사용자 ID는 필수입니다");
    }

    // profileImage 검증
    if (this.props.profileImage === null || this.props.profileImage === undefined) {
      return Result.fail<void>("[UserProfiles] 프로필 이미지는 필수입니다");
    }

    // phoneNumber 검증
    if (this.props.phoneNumber) {
      if (!this.validatePhoneNumber(this.props.phoneNumber)) {
        return Result.fail<void>("[UserProfiles] 유효하지 않은 전화번호 형식입니다");
      }
    }
    // gender 검증
    if (this.props.gender === null || this.props.gender === undefined) {
      return Result.fail<void>("[UserProfiles] 성별은 필수입니다");
    }
    if (!Object.values(Gender).includes(this.props.gender)) {
      return Result.fail<void>("[UserProfiles] 유효하지 않은 성별입니다");
    }

    // introduction 검증
    if (this.props.introduction && this.props.introduction.length > 500) {
      return Result.fail<void>("[UserProfiles] 자기소개는 500자를 초과할 수 없습니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[UserProfiles] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[UserProfiles] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // 한국 전화번호 형식 검증 (010-1234-5678 또는 01012345678)
    const phoneRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
    return phoneRegex.test(phoneNumber.replace(/-/g, ""));
  }

  public isProfileCompleted(): boolean {
    let flag = true;
    if (this.props.mbti === null || this.props.mbti === undefined || this.props.mbti === Mbti.UNSPECIFIED) {
      flag = false;
    }
    if (this.props.gender === null || this.props.gender === undefined || this.props.gender === Gender.UNSPECIFIED) {
      flag = false;
    }
    if (this.props.birthday === null || this.props.birthday === undefined) {
      flag = false;
    }
    return flag;
  }

  public updateProfile(
    props: Partial<{
      profileImage: string;
      phoneNumber: string;
      introduction: string;
      gender: Gender;
      birthday: Dayjs;
      mbti: Mbti;
    }>,
  ): Result<void> {
    if (props.profileImage !== undefined) {
      this.props.profileImage = props.profileImage;
    }
    if (props.phoneNumber !== undefined) {
      if (!this.validatePhoneNumber(props.phoneNumber)) {
        return Result.fail<void>("[UserProfiles] 유효하지 않은 전화번호 형식입니다");
      }
      this.props.phoneNumber = props.phoneNumber;
    }
    if (props.introduction !== undefined) {
      if (props.introduction.length > 500) {
        return Result.fail<void>("[UserProfiles] 자기소개는 500자를 초과할 수 없습니다");
      }
      this.props.introduction = props.introduction;
    }
    if (props.gender !== undefined) {
      this.props.gender = props.gender;
    }
    if (props.birthday !== undefined) {
      this.props.birthday = props.birthday;
    }
    if (props.mbti !== undefined) {
      this.props.mbti = props.mbti;
    }
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }

  // Getters
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get profileImage(): string {
    return this.props.profileImage;
  }

  get phoneNumber(): string {
    return this.props.phoneNumber;
  }

  get gender(): Gender {
    return this.props.gender;
  }

  get birthday(): Dayjs {
    return this.props.birthday;
  }

  get mbti(): Mbti {
    return this.props.mbti;
  }

  get introduction(): string {
    return this.props.introduction;
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
}
