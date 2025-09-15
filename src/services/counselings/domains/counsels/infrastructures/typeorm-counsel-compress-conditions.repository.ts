import { CounselCompressConditionsRepository } from "~counselings/domains/counsels/infrastructures/counsel-compress-conditions.repository";
import { TypeormCounselCompressConditionsMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-counsel-compress-conditions.mapper";
import { CounselCompressConditions } from "~counselings/domains/counsels/models/counsel-compress-conditions";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselCompressConditionId } from "~common/shared-kernel/identifiers/counsel-compress-condition.id";
import { CounselCompressConditionsEntity } from "~common/system/persistences/entities/counsels/counsel-compress-conditions.entity";
import { Repository } from "typeorm";

@Injectable()
export class TypeormCounselCompressConditionsRepository extends CounselCompressConditionsRepository {
  constructor(
    @InjectRepository(CounselCompressConditionsEntity)
    private readonly compressConditionsEntity: Repository<CounselCompressConditionsEntity>,
  ) {
    super();
  }

  async save(compressCondition: CounselCompressConditions): Promise<CounselCompressConditions>;
  async save(compressConditions: CounselCompressConditions[]): Promise<CounselCompressConditions[]>;
  async save(
    compressConditions: CounselCompressConditions | CounselCompressConditions[],
  ): Promise<CounselCompressConditions | CounselCompressConditions[]> {
    if (Array.isArray(compressConditions)) {
      const entities = compressConditions.map((condition) =>
        TypeormCounselCompressConditionsMapper.toEntity(condition),
      );
      const savedEntities = await this.compressConditionsEntity.save(entities);
      return savedEntities.map((entity) => TypeormCounselCompressConditionsMapper.toDomain(entity));
    } else {
      const entity = TypeormCounselCompressConditionsMapper.toEntity(compressConditions);
      const savedEntity = await this.compressConditionsEntity.save(entity);
      return TypeormCounselCompressConditionsMapper.toDomain(savedEntity);
    }
  }

  async findById(compressConditionId: CounselCompressConditionId): Promise<CounselCompressConditions | null> {
    const entity = await this.compressConditionsEntity.findOne({
      where: { id: compressConditionId.getString() },
    });
    return entity ? TypeormCounselCompressConditionsMapper.toDomain(entity) : null;
  }

  async findByCounselId(counselId: CounselId): Promise<CounselCompressConditions | null> {
    const entity = await this.compressConditionsEntity.findOne({
      where: { counselId: counselId.getString() },
    });
    return entity ? TypeormCounselCompressConditionsMapper.toDomain(entity) : null;
  }
}
