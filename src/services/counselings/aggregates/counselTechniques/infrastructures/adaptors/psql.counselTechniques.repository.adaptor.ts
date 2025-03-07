import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselTechniquesEntity } from "~shared/core/infrastructure/entities/CounselTechniques.entity";
import { CounselTechniques } from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { PsqlCounselTechniquesMapper } from "~counselings/aggregates/counselTechniques/infrastructures/adaptors/mappers/psql.counselTechniques.mapper";
import {
  CounselTechniquesRepositoryPort,
  FindFirstPropsInCounselTechniquesRepository,
  FindManyPropsInCounselTechniquesRepository,
} from "~counselings/aggregates/counselTechniques/infrastructures/counselTechniques.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, IsNull, Repository } from "typeorm";

@Injectable()
export class PsqlCounselTechniquesRepositoryAdaptor implements CounselTechniquesRepositoryPort {
  constructor(
    @InjectRepository(CounselTechniquesEntity)
    private readonly counselTechniquesRepository: Repository<CounselTechniquesEntity>,
  ) {}

  async create(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    const counselTechniqueEntity = PsqlCounselTechniquesMapper.toEntity(counselTechnique);
    await this.counselTechniquesRepository.save(counselTechniqueEntity);
    return counselTechnique;
  }

  async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    const counselTechniqueEntity = PsqlCounselTechniquesMapper.toEntity(counselTechnique);
    await this.counselTechniquesRepository.update(counselTechniqueEntity.id, counselTechniqueEntity);
    return counselTechnique;
  }

  async findOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques | null> {
    const counselTechniqueEntity = await this.counselTechniquesRepository.findOne({
      where: { id: counselTechniqueId.getString() },
    });
    if (!counselTechniqueEntity) {
      return null;
    }
    return PsqlCounselTechniquesMapper.toDomain(counselTechniqueEntity);
  }

  async findFirst(props: FindFirstPropsInCounselTechniquesRepository): Promise<CounselTechniques | null> {
    const findOptionsWhere: FindOptionsWhere<CounselTechniquesEntity> = {
      counselTechniqueStage: props.stage,
      prevTechniqueId: IsNull(),
    };
    if (props.toneId) {
      findOptionsWhere.toneId = props.toneId.getString();
    }
    const counselTechniqueEntity = await this.counselTechniquesRepository.findOne({
      where: findOptionsWhere,
      order: { createdAt: "DESC" },
    });
    if (!counselTechniqueEntity) {
      return null;
    }
    return PsqlCounselTechniquesMapper.toDomain(counselTechniqueEntity);
  }

  async findAll(): Promise<CounselTechniques[]> {
    const counselTechniqueEntities = await this.counselTechniquesRepository.find();
    return counselTechniqueEntities
      .map((counselTechniqueEntity) => PsqlCounselTechniquesMapper.toDomain(counselTechniqueEntity))
      .filter((counselTechnique) => counselTechnique !== null);
  }

  async findMany(props: FindManyPropsInCounselTechniquesRepository): Promise<CounselTechniques[]> {
    const findOptionsWhere: FindOptionsWhere<CounselTechniquesEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    const counselTechniqueEntities = await this.counselTechniquesRepository.find({
      where: findOptionsWhere,
    });
    return counselTechniqueEntities
      .map((counselTechniqueEntity) => PsqlCounselTechniquesMapper.toDomain(counselTechniqueEntity))
      .filter((counselTechnique) => counselTechnique !== null);
  }
}
