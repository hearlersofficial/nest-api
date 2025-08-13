import { Tones } from "~counselings/domains/tones/models/tones";

import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { Dayjs } from "dayjs";

/**
 * 외부 노출용 톤 정보 클래스
 */
export class TonesInfo {
  constructor(
    public readonly id: ToneId,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  /**
   * 도메인 모델에서 Info 객체로 변환
   */
  static fromDomain(tone: Tones): TonesInfo {
    return new TonesInfo(tone.id, tone.name, tone.description, tone.createdAt, tone.updatedAt, tone.deletedAt);
  }

  /**
   * 도메인 모델 배열에서 Info 배열로 변환
   */
  static fromDomainArray(tones: Tones[]): TonesInfo[] {
    return tones.map((tone) => TonesInfo.fromDomain(tone));
  }
}
