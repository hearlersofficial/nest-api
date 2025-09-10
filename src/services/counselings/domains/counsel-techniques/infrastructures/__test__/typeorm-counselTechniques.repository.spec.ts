import { TypeormCounselTechniquesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-techniques.mapper";
import { TypeormCounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/typeorm-counsel-techniques.repository";

import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { CounselTechniquesHelper } from "~test/helpers/counselings/counsel-techniques/counsel-techniques.helper";
import { Repository } from "typeorm";

jest.mock("~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-techniques.mapper");

describe("TypeormCounselTechniquesRepository", () => {
  let repository: TypeormCounselTechniquesRepository;
  let typeormRepository: jest.Mocked<Repository<CounselTechniquesEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeormCounselTechniquesRepository,
        {
          provide: getRepositoryToken(CounselTechniquesEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<TypeormCounselTechniquesRepository>(TypeormCounselTechniquesRepository);
    typeormRepository = module.get(getRepositoryToken(CounselTechniquesEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe("findByCounselTechniqueId", () => {
    it("ID로 CounselTechniques를 조회할 수 있다", async () => {
      const id = new CounselTechniqueId();
      const entity = CounselTechniquesHelper.createCounselTechniquesEntity();
      const domain = CounselTechniquesHelper.createCounselTechniques();

      typeormRepository.findOne.mockResolvedValue(entity);
      const toDomainMock = jest.mocked(TypeormCounselTechniquesMapper.toDomain);
      toDomainMock.mockReturnValue(domain);

      const result = await repository.findByCounselTechniqueId(id);

      expect(result).toBe(domain);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({ where: { id: id.getString() } });
      expect(toDomainMock).toHaveBeenCalledWith(entity);
    });

    it("엔티티가 없으면 null을 반환한다", async () => {
      const id = new CounselTechniqueId();
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findByCounselTechniqueId(id);

      expect(result).toBeNull();
      const toDomainMock = jest.mocked(TypeormCounselTechniquesMapper.toDomain);
      expect(toDomainMock).not.toHaveBeenCalled();
    });
  });

  describe("findStartTechnique", () => {
    it("toneId와 promptVersionId로 시작 기법을 조회할 수 있다", async () => {
      const toneId = new ToneId();
      const promptVersionId = new PromptVersionId();
      const entity = CounselTechniquesHelper.createCounselTechniquesEntity();
      const domain = CounselTechniquesHelper.createCounselTechniques();

      typeormRepository.findOne.mockResolvedValue(entity);
      const toDomainMock = jest.mocked(TypeormCounselTechniquesMapper.toDomain);
      toDomainMock.mockReturnValue(domain);

      const result = await repository.findStartTechnique(toneId, promptVersionId);

      expect(result).toBe(domain);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: {
          toneId: toneId.getString(),
          promptVersionId: promptVersionId.getString(),
          isStartTechnique: true,
        },
      });
    });

    it("엔티티가 없으면 null을 반환한다", async () => {
      const toneId = new ToneId();
      const promptVersionId = new PromptVersionId();
      typeormRepository.findOne.mockResolvedValue(null);

      const result = await repository.findStartTechnique(toneId, promptVersionId);

      expect(result).toBeNull();
      const toDomainMock = jest.mocked(TypeormCounselTechniquesMapper.toDomain);
      expect(toDomainMock).not.toHaveBeenCalled();
    });
  });

  describe("findMany", () => {
    it("CounselTechniques 배열을 조회할 수 있다", async () => {
      const entities = CounselTechniquesHelper.createCounselTechniquesEntityArray(2);
      const domains = CounselTechniquesHelper.createCounselTechniquesArray(2);

      typeormRepository.find.mockResolvedValue(entities);
      const toDomainsMock = jest.mocked(TypeormCounselTechniquesMapper.toDomains);
      toDomainsMock.mockReturnValue(domains);

      const result = await repository.findMany();

      expect(result).toBe(domains);
      expect(typeormRepository.find).toHaveBeenCalledWith({});
      expect(toDomainsMock).toHaveBeenCalledWith(entities);
    });
  });

  describe("save", () => {
    it("단일 CounselTechniques를 저장할 수 있다", async () => {
      const domain = CounselTechniquesHelper.createCounselTechniques();
      const entity = CounselTechniquesHelper.createCounselTechniquesEntity();

      const toEntityMock = jest.mocked(TypeormCounselTechniquesMapper.toEntity);
      toEntityMock.mockReturnValue(entity);
      typeormRepository.save.mockResolvedValue(entity);

      const result = await repository.save(domain);

      expect(result).toBe(domain);
      expect(toEntityMock).toHaveBeenCalledWith(domain);
      expect(typeormRepository.save).toHaveBeenCalledWith(entity);
    });

    it("여러 CounselTechniques를 저장할 수 있다", async () => {
      const domains = CounselTechniquesHelper.createCounselTechniquesArray(3);
      const entities = CounselTechniquesHelper.createCounselTechniquesEntityArray(3);

      const toEntitiesMock = jest.mocked(TypeormCounselTechniquesMapper.toEntities);
      toEntitiesMock.mockReturnValue(entities);
      (typeormRepository.save as jest.Mock).mockResolvedValue(entities);

      const result = await repository.save(domains);

      expect(result).toBe(domains);
      expect(toEntitiesMock).toHaveBeenCalledWith(domains);
      expect(typeormRepository.save).toHaveBeenCalledWith(entities);
    });
  });
});
