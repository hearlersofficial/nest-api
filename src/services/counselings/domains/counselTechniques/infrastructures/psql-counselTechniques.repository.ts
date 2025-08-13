import { CounselTechniquesRepository } from "~counselings/domains/counselTechniques/infrastructures/counselTechniques.repository";
import { PsqlCounselTechniquesMapper } from "~counselings/domains/counselTechniques/infrastructures/mappers/psql.counselTechniques.mapper";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/CounselTechniques.entity";
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
    counselTechniqueId: CounselTechniqueId,
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
