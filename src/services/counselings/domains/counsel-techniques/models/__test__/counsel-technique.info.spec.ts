import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";

import { CounselTechniquesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-techniques.helper";

describe("CounselTechniqueInfo", () => {
  describe("fromDomain", () => {
    it("CounselTechniques 도메인 객체로부터 CounselTechniqueInfo를 생성할 수 있다", () => {
      const counselTechnique = CounselTechniquesHelper.createCounselTechniques();
      const counselTechniqueInfo = CounselTechniqueInfo.fromDomain(counselTechnique);

      expect(counselTechniqueInfo.id).toEqual(counselTechnique.id);
      expect(counselTechniqueInfo.promptVersionId).toEqual(counselTechnique.promptVersionId);
      expect(counselTechniqueInfo.name).toBe(counselTechnique.name);
      expect(counselTechniqueInfo.temperature).toBe(counselTechnique.temperature);
      expect(counselTechniqueInfo.toneId).toEqual(counselTechnique.toneId);
      expect(counselTechniqueInfo.context).toBe(counselTechnique.context);
      expect(counselTechniqueInfo.instruction).toBe(counselTechnique.instruction);
      expect(counselTechniqueInfo.isStartTechnique).toBe(counselTechnique.isStartTechnique);
      expect(counselTechniqueInfo.createdAt).toEqual(counselTechnique.createdAt);
      expect(counselTechniqueInfo.updatedAt).toEqual(counselTechnique.updatedAt);
      expect(counselTechniqueInfo.deletedAt).toBeNull();
    });
  });

  describe("fromDomainArray", () => {
    it("CounselTechniques 도메인 객체 배열로부터 CounselTechniqueInfo 배열을 생성할 수 있다", () => {
      const counselTechniques = CounselTechniquesHelper.createCounselTechniquesArray(3);
      const counselTechniqueInfos = CounselTechniqueInfo.fromDomainArray(counselTechniques);

      expect(counselTechniqueInfos).toHaveLength(3);
      expect(counselTechniqueInfos[0].id).toEqual(counselTechniques[0].id);
      expect(counselTechniqueInfos[1].id).toEqual(counselTechniques[1].id);
      expect(counselTechniqueInfos[2].id).toEqual(counselTechniques[2].id);
    });

    it("빈 배열에 대해서도 올바르게 처리한다", () => {
      const counselTechniqueInfos = CounselTechniqueInfo.fromDomainArray([]);

      expect(counselTechniqueInfos).toHaveLength(0);
    });
  });

  describe("constructor", () => {
    it("모든 속성이 올바르게 설정된다", () => {
      const counselTechnique = CounselTechniquesHelper.createCounselTechniques();
      const counselTechniqueInfo = new CounselTechniqueInfo(
        counselTechnique.id,
        counselTechnique.promptVersionId,
        counselTechnique.name,
        counselTechnique.temperature,
        counselTechnique.toneId,
        counselTechnique.context,
        counselTechnique.instruction,
        counselTechnique.isStartTechnique,
        counselTechnique.createdAt,
        counselTechnique.updatedAt,
        counselTechnique.deletedAt,
      );

      expect(counselTechniqueInfo.id).toEqual(counselTechnique.id);
      expect(counselTechniqueInfo.promptVersionId).toEqual(counselTechnique.promptVersionId);
      expect(counselTechniqueInfo.name).toBe(counselTechnique.name);
      expect(counselTechniqueInfo.temperature).toBe(counselTechnique.temperature);
      expect(counselTechniqueInfo.toneId).toEqual(counselTechnique.toneId);
      expect(counselTechniqueInfo.context).toBe(counselTechnique.context);
      expect(counselTechniqueInfo.instruction).toBe(counselTechnique.instruction);
      expect(counselTechniqueInfo.isStartTechnique).toBe(counselTechnique.isStartTechnique);
      expect(counselTechniqueInfo.createdAt).toEqual(counselTechnique.createdAt);
      expect(counselTechniqueInfo.updatedAt).toEqual(counselTechnique.updatedAt);
      expect(counselTechniqueInfo.deletedAt).toBeNull();
    });
  });
});
