import { TypeormCounselTechniqueTransitionRulesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-technique-transition-rules.mapper";
import { TypeormCounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/typeorm-counsel-technique-transition-rules.repository";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { CounselTechniqueTransitionRulesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-technique-transition-rules.helper";
import { Repository } from "typeorm";

jest.mock(
  "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-technique-transition-rules.mapper",
);

describe("TypeormCounselTechniqueTransitionRulesRepository", () => {
  let repository: TypeormCounselTechniqueTransitionRulesRepository;
  let typeormRepository: jest.Mocked<Repository<CounselTechniqueTransitionRuleEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeormCounselTechniqueTransitionRulesRepository,
        {
          provide: getRepositoryToken(CounselTechniqueTransitionRuleEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeormCounselTechniqueTransitionRulesRepository>(
      TypeormCounselTechniqueTransitionRulesRepository,
    );
    typeormRepository = module.get(getRepositoryToken(CounselTechniqueTransitionRuleEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("findById", () => {
    it("ID로 CounselTechniqueTransitionRules를 조회할 수 있다", async () => {
      const id = new CounselTechniqueTransitionRuleId();
      const entity = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity();
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();

      typeormRepository.findOne.mockResolvedValue(entity);
      const toDomainMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomain);
      toDomainMock.mockReturnValue(domain);

      const result = await repository.findById(id);

      expect(result).toBe(domain);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id: id.getString() } });
      expect(toDomainMock).toHaveBeenCalledWith(entity);
    });

    it("엔티티가 없으면 null을 반환한다", async () => {
      const id = new CounselTechniqueTransitionRuleId();
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
      const toDomainMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomain);
      expect(toDomainMock).not.toHaveBeenCalled();
    });
  });

  describe("findEdge", () => {
    it("from, to, promptVersionId로 CounselTechniqueTransitionRules를 조회할 수 있다", async () => {
      const fromId = new CounselTechniqueId();
      const toId = new CounselTechniqueId();
      const promptVersionId = new PromptVersionId();
      const entity = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity();
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();

      typeormRepository.findOne.mockResolvedValue(entity);
      const toDomainMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomain);
      toDomainMock.mockReturnValue(domain);

      const result = await repository.findEdge(fromId, toId, promptVersionId);

      expect(result).toBe(domain);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: {
          fromCounselTechniqueId: fromId.getString(),
          toCounselTechniqueId: toId.getString(),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("엔티티가 없으면 null을 반환한다", async () => {
      const fromId = new CounselTechniqueId();
      const toId = new CounselTechniqueId();
      const promptVersionId = new PromptVersionId();
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findEdge(fromId, toId, promptVersionId);

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("CounselTechniqueTransitionRules 배열을 조회할 수 있다", async () => {
      const entities = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntityArray(2);
      const domains = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(2);

      typeormRepository.find.mockResolvedValue(entities);
      const toDomainsMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomains);
      toDomainsMock.mockReturnValue(domains);

      const result = await repository.findMany();

      expect(result).toBe(domains);
      expect(typeormRepository.find).toHaveBeenCalledWith(undefined);
      expect(toDomainsMock).toHaveBeenCalledWith(entities);
    });
  });

  describe("save", () => {
    it("단일 CounselTechniqueTransitionRules를 저장할 수 있다", async () => {
      const domain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();
      const entity = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity();
      const savedEntity = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntity();
      const savedDomain = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRules();

      const toEntityMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toEntity);
      const toDomainMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomain);

      toEntityMock.mockReturnValue(entity);
      typeormRepository.save.mockResolvedValue(savedEntity);
      toDomainMock.mockReturnValue(savedDomain);

      const result = await repository.save(domain);

      expect(result).toBe(savedDomain);
      expect(toEntityMock).toHaveBeenCalledWith(domain);
      expect(typeormRepository.save).toHaveBeenCalledWith(entity);
      expect(toDomainMock).toHaveBeenCalledWith(savedEntity);
    });

    it("여러 CounselTechniqueTransitionRules를 저장할 수 있다", async () => {
      const domains = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);
      const entities = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRuleEntityArray(3);
      const savedEntities = [...entities];
      const savedDomains = CounselTechniqueTransitionRulesHelper.createCounselTechniqueTransitionRulesArray(3);

      const toEntitiesMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toEntities);
      const toDomainsMock = jest.mocked(TypeormCounselTechniqueTransitionRulesMapper.toDomains);

      toEntitiesMock.mockReturnValue(entities);
      (typeormRepository.save as jest.Mock).mockResolvedValue(savedEntities);
      toDomainsMock.mockReturnValue(savedDomains);

      const result = await repository.save(domains);

      expect(result).toBe(savedDomains);
      expect(toEntitiesMock).toHaveBeenCalledWith(domains);
      expect(typeormRepository.save).toHaveBeenCalledWith(entities);
      expect(toDomainsMock).toHaveBeenCalledWith(savedEntities);
    });
  });
});
