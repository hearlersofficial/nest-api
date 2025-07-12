import { CompressedContextRepository } from "~counselings/domains/compressedContext/infrastructures/compressedContext.repository";
import { PsqlCompressedContextMapper } from "~counselings/domains/compressedContext/infrastructures/mappers/psql.compressedContext.mapper";
import { CompressedContexts } from "~counselings/domains/compressedContext/models/compressedContext";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CompressedContextsEntity } from "~common/system/persistences/entities/councels/CompressedContexts.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class PsqlCompressedContextRepository extends CompressedContextRepository {
  constructor(
    @InjectRepository(CompressedContextsEntity)
    private readonly compressedContextRepository: Repository<CompressedContextsEntity>,
  ) {
    super();
  }

  override async findByCompressedContextId(
    compressedContextId: UniqueEntityId,
    options?: FindOneOptions<CompressedContextsEntity>,
  ): Promise<CompressedContexts | null> {
    const findOneOptions: FindOneOptions<CompressedContextsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: compressedContextId.getString(),
    };
    const compressedContext = await this.compressedContextRepository.findOne(findOneOptions);
    return compressedContext ? PsqlCompressedContextMapper.toDomain(compressedContext) : null;
  }

  override async findMany(options?: FindManyOptions<CompressedContextsEntity>): Promise<CompressedContexts[]> {
    const findManyOptions: FindManyOptions<CompressedContextsEntity> = options ?? {};
    const compressedContexts = await this.compressedContextRepository.find(findManyOptions);
    return PsqlCompressedContextMapper.toDomains(compressedContexts);
  }

  override async save(compressedContext: CompressedContexts): Promise<CompressedContexts>;
  override async save(compressedContexts: CompressedContexts[]): Promise<CompressedContexts[]>;
  override async save(
    compressedContexts: CompressedContexts | CompressedContexts[],
  ): Promise<CompressedContexts | CompressedContexts[]> {
    if (Array.isArray(compressedContexts)) {
      await this.compressedContextRepository.save(PsqlCompressedContextMapper.toEntities(compressedContexts));
      return compressedContexts;
    } else {
      const entity = PsqlCompressedContextMapper.toEntity(compressedContexts);
      await this.compressedContextRepository.save(entity);
      return compressedContexts;
    }
  }
}
