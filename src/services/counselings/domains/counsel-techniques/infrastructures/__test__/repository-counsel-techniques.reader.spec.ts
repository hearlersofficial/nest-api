import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-techniques.repository";
import { RepositoryCounselTechniquesReader } from "~counselings/domains/counsel-techniques/infrastructures/repository-counsel-techniques.reader";

import { Test, TestingModule } from "@nestjs/testing";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { CounselTechniqueTransitionRulesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-technique-transition-rules.helper";
import { CounselTechniquesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-techniques.helper";

jest.mock(
  "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-technique-transition-rules-criteria.mapper",
  () => ({
    RepositoryCounselTechniqueTransitionRulesCriteriaMapper: {
      toFindOneOptions: jest.fn(),
      toFindManyOptions: jest.fn(),
    },
  }),
);

jest.mock(
  "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-techniques-criteria.mapper",
  () => ({
    RepositoryCounselTechniqueCriteriaMapper: {
      toFindOneOptions: jest.fn(),
      toFindManyOptions: jest.fn(),
    },
  }),
);

describe("RepositoryCounselTechniquesReader", () => {
  let reader: RepositoryCounselTechniquesReader;
  let counselTechniquesRepository: jest.Mocked<CounselTechniquesRepository>;
  let counselTechniqueTransitionRulesRepository: jest.Mocked<CounselTechniqueTransitionRulesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryCounselTechniquesReader,
        {
          provide: CounselTechniquesRepository,
          useValue: {
            findByCounselTechniqueId: jest.fn(),
            findStartTechnique: jest.fn(),
            findMany: jest.fn(),
          },
        },
        {
          provide: CounselTechniqueTransitionRulesRepository,
          useValue: {
            findById: jest.fn(),
            findMany: jest.fn(),
          },
        },
      ],
    }).compile();

    reader = module.get<RepositoryCounselTechniquesReader>(RepositoryCounselTechniquesReader);
    counselTechniquesRepository = module.get(CounselTechniquesRepository);
    counselTechniqueTransitionRulesRepository = module.get(CounselTechniqueTransitionRulesRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findOne", () => {
    it("counselTechnique 타입으로 CounselTechniques를 조회할 수 있다", async () => {
      const id = new CounselTechniqueId();
      const mockCounselTechnique = CounselTechniquesHelper.createCounselTechniques();
      counselTechniquesRepository.findByCounselTechniqueId.mockResolvedValue(mockCounselTechnique);

      const result = await reader.findOne({ uniqueCriteria: { type: "counselTechnique", id } });

      expect(result).toBe(mockCounselTechnique);
      expect(counselTechniquesRepository.findByCounselTechniqueId).toHaveBeenCalledWith(id, undefined);
    });

    it("startTechnique 타입으로 CounselTechniques를 조회할 수 있다", async () => {
      const toneId = new ToneId();
      const promptVersionId = new PromptVersionId();
      const mockCounselTechnique = CounselTechniquesHelper.createCounselTechniques();
      counselTechniquesRepository.findStartTechnique.mockResolvedValue(mockCounselTechnique);

      const result = await reader.findOne({ uniqueCriteria: { type: "startTechnique", toneId, promptVersionId } });

      expect(result).toBe(mockCounselTechnique);
      expect(counselTechniquesRepository.findStartTechnique).toHaveBeenCalledWith(toneId, promptVersionId, undefined);
    });

    it("알 수 없는 타입의 경우 null을 반환한다", async () => {
      const result = await reader.findOne({ uniqueCriteria: { type: "unknown" as any, id: new CounselTechniqueId() } });

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("CounselTechniques 배열을 조회할 수 있다", async () => {
      const mockCounselTechniques = CounselTechniquesHelper.createCounselTechniquesArray(3);
      counselTechniquesRepository.findMany.mockResolvedValue(mockCounselTechniques);

      const result = await reader.findMany({});

      expect(result).toBe(mockCounselTechniques);
      expect(counselTechniquesRepository.findMany).toHaveBeenCalled();
    });
  });

  describe("findOneTransitionRule", () => {
    it("counselTechniqueTransitionRule 타입으로 CounselTechniqueTransitionRules를 조회할 수 있다", async () => {
      const id = new CounselTechniqueTransitionRuleId();
      const mockRule = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      counselTechniqueTransitionRulesRepository.findById.mockResolvedValue(mockRule);

      const result = await reader.findOneTransitionRule({
        uniqueCriteria: { type: "counselTechniqueTransitionRule", id },
      });

      expect(result).toBe(mockRule);
      expect(counselTechniqueTransitionRulesRepository.findById).toHaveBeenCalledWith(id, undefined);
    });

    it("알 수 없는 타입의 경우 null을 반환한다", async () => {
      const result = await reader.findOneTransitionRule({
        uniqueCriteria: { type: "unknown" as any, id: new CounselTechniqueTransitionRuleId() },
      });

      expect(result).toBeNull();
    });
  });

  describe("findManyTransitionRules", () => {
    it("CounselTechniqueTransitionRules 배열을 조회할 수 있다", async () => {
      const mockRules = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);
      counselTechniqueTransitionRulesRepository.findMany.mockResolvedValue(mockRules);

      const result = await reader.findManyTransitionRules({});

      expect(result).toBe(mockRules);
      expect(counselTechniqueTransitionRulesRepository.findMany).toHaveBeenCalled();
    });
  });
});
