import { CounselTechniquesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-techniques.repository";
import { TypeormCounselTechniquesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-techniques.mapper";
import { CounselTechniques } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormCounselTechniquesRepository extends CounselTechniquesRepository {
  constructor(
    @InjectRepository(CounselTechniquesEntity)
    private readonly counselTechniquesRepository: Repository<CounselTechniquesEntity>,
  ) {
    super();
  }

  private readonly mapper = TypeormCounselTechniquesMapper;

  override async findByCounselTechniqueId(
    counselTechniqueId: CounselTechniqueId,
    options?: FindOneOptions<CounselTechniquesEntity>,
  ): Promise<CounselTechniques | null> {
    const findOneOptions: FindOneOptions<CounselTechniquesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselTechniqueId.getString(),
    };
    const counselTechnique = await this.counselTechniquesRepository.findOne(findOneOptions);
    return counselTechnique ? this.mapper.toDomain(counselTechnique) : null;
  }

  override async findStartTechnique(
    toneId: ToneId,
    promptVersionId: PromptVersionId,
    options?: FindOneOptions<CounselTechniquesEntity>,
  ): Promise<CounselTechniques | null> {
    const findOneOptions: FindOneOptions<CounselTechniquesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      toneId: toneId.getString(),
      promptVersionId: promptVersionId.getString(),
      isStartTechnique: true,
    };
    const counselTechnique = await this.counselTechniquesRepository.findOne(findOneOptions);
    return counselTechnique ? this.mapper.toDomain(counselTechnique) : null;
  }

  override async findMany(options?: FindManyOptions<CounselTechniquesEntity>): Promise<CounselTechniques[]> {
    const findManyOptions: FindManyOptions<CounselTechniquesEntity> = options ?? {};
    const counselTechniques = await this.counselTechniquesRepository.find(findManyOptions);
    return this.mapper.toDomains(counselTechniques);
  }

  override async save(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  override async save(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
  async save(
    counselTechnique: CounselTechniques | CounselTechniques[],
  ): Promise<CounselTechniques | CounselTechniques[]> {
    if (Array.isArray(counselTechnique)) {
      await this.counselTechniquesRepository.save(this.mapper.toEntities(counselTechnique));
      return counselTechnique;
    } else {
      const counselTechniqueEntity = this.mapper.toEntity(counselTechnique);
      await this.counselTechniquesRepository.save(counselTechniqueEntity);
      return counselTechnique;
    }
  }
}
