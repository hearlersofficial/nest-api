import { KakaoInfo } from "~users/domains/auth-users/models/kakao.info";
import { Kakao } from "~users/domains/auth-users/models/kakao";

import { fakerKO as faker } from "@faker-js/faker";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { getNowDayjs } from "~common/shared/utils/date";

describe("KakaoInfo", () => {
  const createKakao = () => {
    const props = {
      authUserId: new UniqueEntityId(),
      uniqueId: faker.string.numeric(10),
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return Kakao.create(props, new UniqueEntityId()).value as Kakao;
  };

  describe("fromDomain", () => {
    it("Kakao 도메인 객체로부터 KakaoInfo를 생성할 수 있다", () => {
      const kakao = createKakao();
      const kakaoInfo = KakaoInfo.fromDomain(kakao);

      expect(kakaoInfo.id).toBe(kakao.id.getString());
      expect(kakaoInfo.authUserId).toBe(kakao.authUserId.getString());
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
      expect(kakaoInfos[0].id).toBe(kakaos[0].id.getString());
      expect(kakaoInfos[1].id).toBe(kakaos[1].id.getString());
    });
  });
});
