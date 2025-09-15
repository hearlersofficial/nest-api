import { CounselContextsRepository } from "~counselings/domains/counsels/infrastructures/counsel-contexts.repository";
import { TypeormCounselContextsMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-counsel-contexts.mapper";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselContextId } from "~common/shared-kernel/identifiers/counsel-context.id";
import { CounselContextsEntity } from "~common/system/persistences/entities/counsels/counsel-contexts.entity";
import { Repository } from "typeorm";

@Injectable()
export class TypeormCounselContextsRepository extends CounselContextsRepository {
  constructor(
    @InjectRepository(CounselContextsEntity)
    private readonly counselContextsEntity: Repository<CounselContextsEntity>,
  ) {
    super();
  }

  async save(counselContext: CounselContexts): Promise<CounselContexts>;
  async save(counselContexts: CounselContexts[]): Promise<CounselContexts[]>;
  async save(counselContexts: CounselContexts | CounselContexts[]): Promise<CounselContexts | CounselContexts[]> {
    if (Array.isArray(counselContexts)) {
      const entities = counselContexts.map((context) => TypeormCounselContextsMapper.toEntity(context));
      const savedEntities = await this.counselContextsEntity.save(entities);
      return savedEntities.map((entity) => TypeormCounselContextsMapper.toDomain(entity));
    } else {
      const entity = TypeormCounselContextsMapper.toEntity(counselContexts);
      const savedEntity = await this.counselContextsEntity.save(entity);
      return TypeormCounselContextsMapper.toDomain(savedEntity);
    }
  }

  async findById(counselContextId: CounselContextId): Promise<CounselContexts | null> {
    const entity = await this.counselContextsEntity.findOne({
      where: { id: counselContextId.getString() },
    });
    return entity ? TypeormCounselContextsMapper.toDomain(entity) : null;
  }

  async findByCounselId(counselId: CounselId): Promise<CounselContexts | null> {
    const entity = await this.counselContextsEntity.findOne({
      where: { counselId: counselId.getString() },
    });
    return entity ? TypeormCounselContextsMapper.toDomain(entity) : null;
  }
}
