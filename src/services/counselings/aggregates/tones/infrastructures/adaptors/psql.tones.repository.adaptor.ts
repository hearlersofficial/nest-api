import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { ToneEntity } from "~shared/core/infrastructure/entities/prompts/Tones.entity";
import { Tones } from "~counselings/aggregates/tones/domain/tones";
import { PsqlTonesMapper } from "~counselings/aggregates/tones/infrastructures/adaptors/mappers/psql.tones.mapper";
import { FindManyPropsInTonesRepository, ToneRepositoryPort } from "~counselings/aggregates/tones/infrastructures/tones.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlTonesRepositoryAdaptor implements ToneRepositoryPort {
  constructor(
    @InjectRepository(ToneEntity)
    private readonly tonesRepository: Repository<ToneEntity>,
  ) {}

  async create(tone: Tones): Promise<Tones> {
    const toneEntity = PsqlTonesMapper.toEntity(tone);
    await this.tonesRepository.save(toneEntity);
    return tone;
  }

  async update(tone: Tones): Promise<Tones> {
    const toneEntity = PsqlTonesMapper.toEntity(tone);
    await this.tonesRepository.update(toneEntity.id, toneEntity);
    return tone;
  }

  async findOne(toneId: UniqueEntityId): Promise<Tones> {
    const toneEntity = await this.tonesRepository.findOne({
      where: { id: toneId.getString() },
    });
    return PsqlTonesMapper.toDomain(toneEntity);
  }

  async findAll(): Promise<Tones[]> {
    const toneEntities = await this.tonesRepository.find();
    return toneEntities.map((toneEntity) => PsqlTonesMapper.toDomain(toneEntity));
  }

  async findMany(props: FindManyPropsInTonesRepository): Promise<Tones[]> {
    const findOptionsWhere: FindOptionsWhere<ToneEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    const toneEntities = await this.tonesRepository.find({
      where: findOptionsWhere,
    });
    return toneEntities.map((toneEntity) => PsqlTonesMapper.toDomain(toneEntity));
  }
}
