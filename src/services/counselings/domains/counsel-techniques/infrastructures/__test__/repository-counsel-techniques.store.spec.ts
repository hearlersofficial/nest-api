import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-techniques.repository";
import { RepositoryCounselTechniquesStore } from "~counselings/domains/counsel-techniques/infrastructures/repository-counsel-techniques.store";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { CounselTechniqueTransitionRulesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-technique-transition-rules.helper";
import { CounselTechniquesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-techniques.helper";

describe("RepositoryCounselTechniquesStore", () => {
  let store: RepositoryCounselTechniquesStore;
  let counselTechniquesRepository: jest.Mocked<CounselTechniquesRepository>;
  let counselTechniqueTransitionRulesRepository: jest.Mocked<CounselTechniqueTransitionRulesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryCounselTechniquesStore,
        {
          provide: CounselTechniquesRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: CounselTechniqueTransitionRulesRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    store = module.get<RepositoryCounselTechniquesStore>(RepositoryCounselTechniquesStore);
    counselTechniquesRepository = module.get(CounselTechniquesRepository);
    counselTechniqueTransitionRulesRepository = module.get(CounselTechniqueTransitionRulesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("새로운 CounselTechniques를 생성할 수 있다", async () => {
      const newProps = CounselTechniquesHelper.createCounselTechniquesNewProps();
      const mockCounselTechnique = CounselTechniquesHelper.createCounselTechniquesArray(2);
      counselTechniquesRepository.save.mockResolvedValue(mockCounselTechnique);

      const result = await store.create(newProps);

      expect(result).toBe(mockCounselTechnique);
      expect(counselTechniquesRepository.save).toHaveBeenCalledWith(expect.any(CounselTechniques));
    });

    it("CounselTechniques 생성에 실패하면 HttpStatusBasedRpcException을 던진다", async () => {
      const newProps = {
        ...CounselTechniquesHelper.createCounselTechniquesNewProps(),
        name: undefined as any,
      };

      await expect(store.create(newProps)).rejects.toThrow(HttpStatusBasedRpcException);
    });

    it("repository 저장에 실패하면 예외를 전파한다", async () => {
      const newProps = CounselTechniquesHelper.createCounselTechniquesNewProps();
      const error = new Error("Database error");
      counselTechniquesRepository.save.mockRejectedValue(error);

      await expect(store.create(newProps)).rejects.toThrow(error);
    });
  });

  describe("update", () => {
    it("CounselTechniques를 업데이트할 수 있다", async () => {
      const mockCounselTechnique = CounselTechniquesHelper.createCounselTechniques();
      counselTechniquesRepository.save.mockResolvedValue(mockCounselTechnique as any); // NOTE: test에서 오버로드 시그니처 추론 못해서 임시로

      const result = await store.update(mockCounselTechnique);

      expect(result).toBe(mockCounselTechnique);
      expect(counselTechniquesRepository.save).toHaveBeenCalledWith(mockCounselTechnique);
    });
  });

  describe("updateMany", () => {
    it("여러 CounselTechniques를 업데이트할 수 있다", async () => {
      const mockCounselTechniques = CounselTechniquesHelper.createCounselTechniquesArray(3);
      counselTechniquesRepository.save.mockResolvedValue(mockCounselTechniques);

      const result = await store.updateMany(mockCounselTechniques);

      expect(result).toBe(mockCounselTechniques);
      expect(counselTechniquesRepository.save).toHaveBeenCalledWith(mockCounselTechniques);
    });
  });

  describe("createTransitionRule", () => {
    it("새로운 CounselTechniqueTransitionRules를 생성할 수 있다", async () => {
      const newProps = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesNewProps();
      const mockRule = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(2);
      counselTechniqueTransitionRulesRepository.save.mockResolvedValue(mockRule);

      const result = await store.createTransitionRule(newProps);

      expect(result).toBe(mockRule);
      expect(counselTechniqueTransitionRulesRepository.save).toHaveBeenCalledWith(
        expect.any(CounselTechniqueTransitionRules),
      );
    });

    it("CounselTechniqueTransitionRules 생성에 실패하면 HttpStatusBasedRpcException을 던진다", async () => {
      const newProps = {
        ...CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesNewProps(),
        fromCounselTechniqueId: null as any,
      };

      await expect(store.createTransitionRule(newProps)).rejects.toThrow(HttpStatusBasedRpcException);
    });
  });

  describe("updateTransitionRule", () => {
    it("CounselTechniqueTransitionRules를 업데이트할 수 있다", async () => {
      const mockRule = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      counselTechniqueTransitionRulesRepository.save.mockResolvedValue(mockRule as any); // NOTE: test에서 오버로드 시그니처 추론 못해서 임시로

      const result = await store.updateTransitionRule(mockRule);

      expect(result).toBe(mockRule);
      expect(counselTechniqueTransitionRulesRepository.save).toHaveBeenCalledWith(mockRule);
    });
  });

  describe("updateManyTransitionRules", () => {
    it("여러 CounselTechniqueTransitionRules를 업데이트할 수 있다", async () => {
      const mockRules = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);
      counselTechniqueTransitionRulesRepository.save.mockResolvedValue(mockRules);

      const result = await store.updateManyTransitionRules(mockRules);

      expect(result).toBe(mockRules);
      expect(counselTechniqueTransitionRulesRepository.save).toHaveBeenCalledWith(mockRules);
    });
  });
});
