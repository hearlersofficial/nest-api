import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselors.entity";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { PsqlCounselorsMapper } from "~counselings/aggregates/counselors/infrastructures/adaptors/mapper/psql.counselors.mapper";
import { CounselorsRepositoryPort, FindManyPropsInCounselorsRepository } from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlCounselorsRepositoryAdaptor implements CounselorsRepositoryPort {
  constructor(
    @InjectRepository(CounselorsEntity)
    private readonly counselorsRepository: Repository<CounselorsEntity>,
  ) {}

  async create(counselor: Counselors): Promise<Counselors> {
    const counselorsEntity = PsqlCounselorsMapper.toEntity(counselor);
    await this.counselorsRepository.save(counselorsEntity);
    return counselor;
  }

  async update(counselor: Counselors): Promise<Counselors> {
    const counselorsEntity = PsqlCounselorsMapper.toEntity(counselor);
    await this.counselorsRepository.update(counselorsEntity.id, counselorsEntity);
    return counselor;
  }

  async findOne(counselorId: UniqueEntityId): Promise<Counselors> {
    const counselorsEntity: CounselorsEntity = await this.counselorsRepository.findOne({
      where: { id: counselorId.getString() },
    });
    return PsqlCounselorsMapper.toDomain(counselorsEntity);
  }

  async findAll(): Promise<Counselors[]> {
    const counselorsEntities = await this.counselorsRepository.find();
    return counselorsEntities.map((counselorsEntity) => PsqlCounselorsMapper.toDomain(counselorsEntity));
  }

  async findMany(props: FindManyPropsInCounselorsRepository): Promise<Counselors[] | null> {
    const findOptionsWhere: FindOptionsWhere<CounselorsEntity> = {};
    if (props.name) {
      findOptionsWhere.name = props.name;
    }
    if (props.toneId) {
      findOptionsWhere.toneId = props.toneId.getString();
    }

    const counselorsEntities: CounselorsEntity[] = await this.counselorsRepository.find({
      where: findOptionsWhere,
    });
    return counselorsEntities.map((counselorsEntity) => PsqlCounselorsMapper.toDomain(counselorsEntity));
  }
}
