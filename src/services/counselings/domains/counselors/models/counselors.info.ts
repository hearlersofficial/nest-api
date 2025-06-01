import { Bubbles } from "~counselings/domains/counselors/models/bubbles";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorGender } from "~proto/com/hearlers/v1/model/counselor_pb";

import { Dayjs } from "dayjs";

/**
 * 외부 노출용 버블 정보 클래스
 */
export class BubblesInfo {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly responseOption1: string,
    public readonly responseOption2: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(bubble: Bubbles): BubblesInfo {
    return new BubblesInfo(
      bubble.id.getString(),
      bubble.question,
      bubble.responseOption1,
      bubble.responseOption2,
      bubble.createdAt,
      bubble.updatedAt,
      bubble.deletedAt,
    );
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(bubbles: Bubbles[]): BubblesInfo[] {
    return bubbles.map((bubble) => BubblesInfo.fromDomain(bubble));
  }
}

/**
 * 외부 노출용 상담사 정보 클래스
 */
export class CounselorsInfo {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly gender: CounselorGender,
    public readonly description: string,
    public readonly toneId: string,
    public readonly profileImage: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(counselor: Counselors): CounselorsInfo {
    return new CounselorsInfo(
      counselor.id.getString(),
      counselor.name,
      counselor.gender,
      counselor.description,
      counselor.toneId.getString(),
      counselor.profileImage,
      counselor.createdAt,
      counselor.updatedAt,
      counselor.deletedAt,
    );
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(counselors: Counselors[]): CounselorsInfo[] {
    return counselors.map((counselor) => CounselorsInfo.fromDomain(counselor));
  }
}
