import { fakerKO as faker } from "@faker-js/faker";
import { Kakao } from "./Kakao";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { advanceTo, clear } from "jest-date-mock";

describe("Kakao", () => {
  const fixedDate = "2024-01-01T00:00:00.000Z";

  beforeAll(() => {
    advanceTo(new Date(fixedDate));
  });

  afterAll(() => {
    clear();
  });

  const validProps = {
    authUserId: new UniqueEntityId(),
    uniqueId: faker.string.numeric(10), // 카카오 고유 ID 형식으로 생성
  };

  describe("createNew", () => {
    it("새로운 Kakao를 생성할 수 있다", () => {
      const result = Kakao.createNew(validProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const kakao = result.value;
        expect(kakao.authUserId.equals(validProps.authUserId)).toBe(true);
        expect(kakao.uniqueId).toBe(validProps.uniqueId);
        expect(kakao.createdAt.toISOString()).toBe(fixedDate);
        expect(kakao.updatedAt.toISOString()).toBe(fixedDate);
        expect(kakao.deletedAt).toBeNull();
      }
    });

    it("userId가 없��면 생성에 실패한다", () => {
      const result = Kakao.createNew({
        ...validProps,
        authUserId: undefined as unknown as UniqueEntityId,
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[Kakao] 사용자 ID는 필수입니다");
    });

    it("uniqueId가 없으면 생성에 실패한다", () => {
      const result = Kakao.createNew({
        ...validProps,
        uniqueId: "",
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[Kakao] Kakao 고유 ID는 필수입니다");
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const kakao = Kakao.createNew(validProps).value as Kakao;

      expect(kakao.deletedAt).toBeNull();

      kakao.delete();
      expect(kakao.deletedAt?.toISOString()).toBe(fixedDate);

      kakao.restore();
      expect(kakao.deletedAt).toBeNull();
    });
  });

  describe("getters", () => {
    it("모든 getter가 올바른 값을 반환한다", () => {
      const kakao = Kakao.createNew(validProps).value as Kakao;

      expect(kakao.authUserId.equals(validProps.authUserId)).toBe(true);
      expect(kakao.uniqueId).toBe(validProps.uniqueId);
      expect(kakao.createdAt.toISOString()).toBe(fixedDate);
      expect(kakao.updatedAt.toISOString()).toBe(fixedDate);
      expect(kakao.deletedAt).toBeNull();
    });
  });
});
