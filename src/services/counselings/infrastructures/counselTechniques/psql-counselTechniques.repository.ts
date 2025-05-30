import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/prompts/CounselTechniques.entity";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";
import { CounselTechniquesRepository } from "~counselings/infrastructures/counselTechniques/counselTechniques.repository";
import { PsqlCounselTechniquesMapper } from "~counselings/infrastructures/counselTechniques/mappers/psql.counselTechniques.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlCounselTechniquesRepository extends CounselTechniquesRepository {
  constructor(
    @InjectRepository(CounselTechniquesEntity)
    private readonly counselTechniquesRepository: Repository<CounselTechniquesEntity>,
  ) {
    super();
  }

  override async findByCounselTechniqueId(
    counselTechniqueId: UniqueEntityId,
    options?: FindOneOptions<CounselTechniquesEntity>,
  ): Promise<CounselTechniques | null> {
    const findOneOptions: FindOneOptions<CounselTechniquesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselTechniqueId.getString(),
    };
    const counselTechnique = await this.counselTechniquesRepository.findOne(findOneOptions);
    return counselTechnique ? PsqlCounselTechniquesMapper.toDomain(counselTechnique) : null;
  }

  override async findMany(options?: FindManyOptions<CounselTechniquesEntity>): Promise<CounselTechniques[]> {
    const findManyOptions: FindManyOptions<CounselTechniquesEntity> = options ?? {};
    const counselTechniques = await this.counselTechniquesRepository.find(findManyOptions);
    return PsqlCounselTechniquesMapper.toDomains(counselTechniques);
  }

  override async save(counselTechnique: CounselTechniques): Promise<CounselTechniques>;
  override async save(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]>;
  async save(
    counselTechnique: CounselTechniques | CounselTechniques[],
  ): Promise<CounselTechniques | CounselTechniques[]> {
    if (Array.isArray(counselTechnique)) {
      await this.counselTechniquesRepository.save(PsqlCounselTechniquesMapper.toEntities(counselTechnique));
      return counselTechnique;
    } else {
      const counselTechniqueEntity = PsqlCounselTechniquesMapper.toEntity(counselTechnique);
      await this.counselTechniquesRepository.save(counselTechniqueEntity);
      return counselTechnique;
    }
  }
}
