import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { Tones } from "~counselings/domains/tones/models/tones";
import { PsqlTonesMapper } from "~counselings/infrastructures/tones/mappers/psql.tones.mapper";
import { TonesRepository } from "~counselings/infrastructures/tones/tones.repository";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlTonesRepository extends TonesRepository {
  constructor(
    @InjectRepository(ToneEntity)
    private readonly tonesRepository: Repository<ToneEntity>,
  ) {
    super();
  }

  override async findByToneId(toneId: UniqueEntityId, options?: FindOneOptions<ToneEntity>): Promise<Tones | null> {
    const findOneOptions: FindOneOptions<ToneEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: toneId.getString(),
    };
    const tone = await this.tonesRepository.findOne(findOneOptions);
    return tone ? PsqlTonesMapper.toDomain(tone) : null;
  }

  override async findMany(options?: FindManyOptions<ToneEntity>): Promise<Tones[]> {
    const findManyOptions: FindManyOptions<ToneEntity> = options ?? {};
    const tones = await this.tonesRepository.find(findManyOptions);
    return PsqlTonesMapper.toDomains(tones);
  }

  override async save(tone: Tones): Promise<Tones>;
  override async save(tones: Tones[]): Promise<Tones[]>;
  async save(tone: Tones | Tones[]): Promise<Tones | Tones[]> {
    if (Array.isArray(tone)) {
      await this.tonesRepository.save(PsqlTonesMapper.toEntities(tone));
      return tone;
    } else {
      const toneEntity = PsqlTonesMapper.toEntity(tone);
      await this.tonesRepository.save(toneEntity);
      return tone;
    }
  }
}
