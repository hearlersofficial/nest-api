import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/CounselMessages.entity";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { PsqlCounselMessagesMapper } from "~counselings/aggregates/counselMessages/infrastructures/adaptors/mapper/psql.counselMessages.mapper";
import {
  CounselMessagesRepositoryPort,
  FindManyPropsInCounselMessagesRepository,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

@Injectable()
export class PsqlCounselMessagesRepositoryAdaptor implements CounselMessagesRepositoryPort {
  constructor(
    @InjectRepository(CounselMessagesEntity)
    private readonly counselMessagesRepository: Repository<CounselMessagesEntity>,
    @Inject(KAFKA_CLIENT) private readonly kafkaProducer: ClientKafka,
  ) {}

  async publishDomainEvents(counselMessage: CounselMessages): Promise<void> {
    const domainEvents = counselMessage.domainEvents;
    for (const domainEvent of domainEvents) {
      this.kafkaProducer.emit(domainEvent.topic, domainEvent.binary);
    }
    counselMessage.clearEvents();
  }

  async create(counselMessage: CounselMessages): Promise<CounselMessages> {
    const counselMessagesEntity = PsqlCounselMessagesMapper.toEntity(counselMessage);
    await this.counselMessagesRepository.save(counselMessagesEntity);

    await this.publishDomainEvents(counselMessage);

    return counselMessage;
  }

  async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    const counselMessagesEntity = PsqlCounselMessagesMapper.toEntity(counselMessage);
    await this.counselMessagesRepository.update(counselMessagesEntity.id, counselMessagesEntity);

    await this.publishDomainEvents(counselMessage);

    return counselMessage;
  }

  async findOne(counselMessageId: UniqueEntityId): Promise<CounselMessages | null> {
    const counselMessagesEntity: CounselMessagesEntity | null = await this.counselMessagesRepository.findOne({
      where: { id: counselMessageId.getString() },
    });
    if (!counselMessagesEntity) {
      return null;
    }
    return PsqlCounselMessagesMapper.toDomain(counselMessagesEntity);
  }

  async findAll(): Promise<CounselMessages[]> {
    const counselMessagesEntities = await this.counselMessagesRepository.find();
    return counselMessagesEntities
      .map((counselMessagesEntity) => PsqlCounselMessagesMapper.toDomain(counselMessagesEntity))
      .filter((counselMessage) => counselMessage !== null);
  }

  async findMany(props: FindManyPropsInCounselMessagesRepository): Promise<CounselMessages[]> {
    const findOptionsWhere: FindOptionsWhere<CounselMessagesEntity> = {};
    if (props.counselId) {
      findOptionsWhere.counselId = props.counselId.getString();
    }
    const findOptionsOrder: FindOptionsOrder<CounselMessagesEntity> = { createdAt: "ASC" };

    const findManyOptions: FindManyOptions<CounselMessagesEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselMessagesEntities = await this.counselMessagesRepository.find(findManyOptions);
    const counselMessageList = counselMessagesEntities
      .map((counselMessagesEntity) => PsqlCounselMessagesMapper.toDomain(counselMessagesEntity))
      .filter((counselMessage) => counselMessage !== null);
    if (counselMessageList.length > 0) {
      for (const counselMessage of counselMessageList) {
        await this.publishDomainEvents(counselMessage);
      }
    }

    return counselMessageList;
  }
}
