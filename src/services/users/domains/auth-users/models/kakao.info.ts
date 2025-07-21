import { Kakao } from "~users/domains/auth-users/models/kakao";

import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { KakaoId } from "~common/shared-kernel/identifiers/kakao.id";
import { Dayjs } from "dayjs";

export class KakaoInfo {
  constructor(
    public readonly id: KakaoId,
    public readonly authUserId: AuthUserId,
    public readonly uniqueId: string,
    public readonly createdAt: Dayjs,
    public readonly updatedAt: Dayjs,
    public readonly deletedAt: Dayjs | null,
  ) {}

  static fromDomain(kakao: Kakao): KakaoInfo {
    return new KakaoInfo(kakao.id, kakao.authUserId, kakao.uniqueId, kakao.createdAt, kakao.updatedAt, kakao.deletedAt);
  }

  static fromDomainArray(kakaos: Kakao[]): KakaoInfo[] {
    return kakaos.map((kakao) => KakaoInfo.fromDomain(kakao));
  }
}
