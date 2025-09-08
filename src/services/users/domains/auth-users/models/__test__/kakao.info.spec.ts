import { Kakao, KakaoProps } from "~users/domains/auth-users/models/kakao";
import { KakaoInfo } from "~users/domains/auth-users/models/kakao.info";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { AuthUserId } from "~common/shared-kernel/identifiers/auth-user.id";
import { KakaoId } from "~common/shared-kernel/identifiers/kakao.id";

describe("KakaoInfo", () => {
  const createKakao = () => {
    const props: KakaoProps = {
      authUserId: new AuthUserId(),
      uniqueId: faker.string.numeric(10),
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return Kakao.create(props, new KakaoId()).value as Kakao;
  };

  describe("fromDomain", () => {
    it("Kakao 도메인 객체로부터 KakaoInfo를 생성할 수 있다", () => {
      const kakao = createKakao();
      const kakaoInfo = KakaoInfo.fromDomain(kakao);

      expect(kakaoInfo.id).toEqual(kakao.id);
      expect(kakaoInfo.authUserId).toEqual(kakao.authUserId);
      expect(kakaoInfo.uniqueId).toBe(kakao.uniqueId);
      expect(kakaoInfo.createdAt).toEqual(kakao.createdAt);
      expect(kakaoInfo.updatedAt).toEqual(kakao.updatedAt);
      expect(kakaoInfo.deletedAt).toBeNull();
    });
  });

  describe("fromDomainArray", () => {
    it("Kakao 도메인 객체 배열로부터 KakaoInfo 배열을 생성할 수 있다", () => {
      const kakaos = [createKakao(), createKakao()];
      const kakaoInfos = KakaoInfo.fromDomainArray(kakaos);

      expect(kakaoInfos).toHaveLength(2);
      expect(kakaoInfos[0].id).toEqual(kakaos[0].id);
      expect(kakaoInfos[1].id).toEqual(kakaos[1].id);
    });
  });
});
