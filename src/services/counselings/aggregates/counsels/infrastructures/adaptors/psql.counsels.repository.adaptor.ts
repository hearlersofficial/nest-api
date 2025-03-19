import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
import { PsqlCounselsMapper } from "~counselings/aggregates/counsels/infrastructures/adaptors/mapper/psql.counsels.mapper";
import { CounselsRepositoryPort, FindManyPropsInCounselsRepository } from "~counselings/aggregates/counsels/infrastructures/counsels.repository.port";

import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlCounselsRepositoryAdaptor implements CounselsRepositoryPort {
  constructor(
    @InjectRepository(CounselsEntity) private readonly counselsRepository: Repository<CounselsEntity>,
    @Inject(KAFKA_CLIENT) private readonly kafkaProducer: ClientKafka,
  ) {}

  async publishDomainEvents(counsel: Counsels): Promise<void> {
    const domainEvents = counsel.domainEvents;
    for (const domainEvent of domainEvents) {
      this.kafkaProducer.emit(domainEvent.topic, domainEvent.binary);
    }
    counsel.clearEvents();
  }

  async create(counsel: Counsels): Promise<Counsels> {
    const counselsEntity = PsqlCounselsMapper.toEntity(counsel);
    await this.counselsRepository.save(counselsEntity);

    await this.publishDomainEvents(counsel);

    return counsel;
  }

  async update(counsel: Counsels): Promise<Counsels> {
    const counselsEntity = PsqlCounselsMapper.toEntity(counsel);
    await this.counselsRepository.update(counselsEntity.id, counselsEntity);

    await this.publishDomainEvents(counsel);

    return counsel;
  }

  async findOne(counselId: UniqueEntityId): Promise<Counsels | null> {
    const counselsEntity: CounselsEntity | null = await this.counselsRepository.findOne({
      where: { id: counselId.getString() },
    });
    if (!counselsEntity) {
      return null;
    }
    return PsqlCounselsMapper.toDomain(counselsEntity);
  }

  async findAll(): Promise<Counsels[]> {
    const counselsEntities: CounselsEntity[] = await this.counselsRepository.find();
    return counselsEntities.map((counselEntity) => PsqlCounselsMapper.toDomain(counselEntity)).filter((counsel) => counsel !== null);
  }

  async findMany(props: FindManyPropsInCounselsRepository): Promise<Counsels[]> {
    const findOptionsWhere: FindOptionsWhere<CounselsEntity> = {};
    if (props.userId) {
      findOptionsWhere.userId = props.userId.getString();
    }
    if (props.counselorId) {
      findOptionsWhere.counselorId = props.counselorId.getString();
    }
    const findOptionsOrder: FindOptionsOrder<CounselsEntity> = { lastChatedAt: "DESC" };

    const findManyOptions: FindManyOptions<CounselsEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselsEntities: CounselsEntity[] = await this.counselsRepository.find(findManyOptions);
    return counselsEntities.map((entity) => PsqlCounselsMapper.toDomain(entity)).filter((counsel) => counsel !== null);
  }
}
