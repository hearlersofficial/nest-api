import { Kakao } from "~users/domains/auth-users/models/kakao";

import { Dayjs } from "dayjs";

export class KakaoInfo {
  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public readonly uniqueId: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(kakao: Kakao): KakaoInfo {
    return new KakaoInfo(
      kakao.id.getString(),
      kakao.authUserId.getString(),
      kakao.uniqueId,
      kakao.createdAt,
      kakao.updatedAt,
      kakao.deletedAt,
    );
  }

  static fromDomainArray(kakaos: Kakao[]): KakaoInfo[] {
    return kakaos.map((kakao) => KakaoInfo.fromDomain(kakao));
  }
}
