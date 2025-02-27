import { KAFKA_CLIENT } from "~shared/core/infrastructure/Config";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/CounselMessages.entity";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { PsqlCounselMessagesMapper } from "~counselings/aggregates/counselMessages/infrastructures/adaptors/mapper/psql.counselMessages.mapper";
import {
  CounselMessagesRepositoryPort,
  FindManyPropsInCounselMessagesRepository,
  FindOnePropsInCounselMessagesRepository,
} from "~counselings/aggregates/counselMessages/infrastructures/counselMessages.repository.port";

import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

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
    const createdCounselMessagesEntity = await this.counselMessagesRepository.save(counselMessagesEntity);
    const createdCounselMessage = PsqlCounselMessagesMapper.toDomain(createdCounselMessagesEntity);
    createdCounselMessage.addCreatedEvent();

    await this.publishDomainEvents(counselMessage);
    await this.publishDomainEvents(createdCounselMessage);

    return createdCounselMessage;
  }

  async findMany(props: FindManyPropsInCounselMessagesRepository): Promise<CounselMessages[]> {
    const { counselId } = props;
    const findOptionsWhere: FindOptionsWhere<CounselMessagesEntity> = {};
    if (counselId !== null && counselId !== undefined) {
      findOptionsWhere.counselId = counselId.getString();
    }

    const findOptionsOrder: FindOptionsOrder<CounselMessagesEntity> = { createdAt: "ASC" };

    const findManyOptions: FindManyOptions<CounselMessagesEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselMessagesEntities = await this.counselMessagesRepository.find(findManyOptions);
    const counselMessageList = counselMessagesEntities.map((counselMessagesEntity) => PsqlCounselMessagesMapper.toDomain(counselMessagesEntity));
    if (counselMessageList.length > 0) {
      for (const counselMessage of counselMessageList) {
        await this.publishDomainEvents(counselMessage);
      }
    }

    return counselMessageList;
  }

  async findOne(props: FindOnePropsInCounselMessagesRepository): Promise<CounselMessages> {
    const { counselMessageId } = props;
    const findOptionsWhere: FindOptionsWhere<CounselMessagesEntity> = {};
    if (counselMessageId !== null && counselMessageId !== undefined) {
      findOptionsWhere.id = counselMessageId.getString();
    }
    const findOneOptions: FindOneOptions<CounselMessagesEntity> = { where: findOptionsWhere };
    const counselMessagesEntity = await this.counselMessagesRepository.findOne(findOneOptions);
    const counselMessage = PsqlCounselMessagesMapper.toDomain(counselMessagesEntity);
    await this.publishDomainEvents(counselMessage);

    return counselMessage;
  }

  async update(counselMessage: CounselMessages): Promise<CounselMessages> {
    const counselMessagesEntity = PsqlCounselMessagesMapper.toEntity(counselMessage);
    const updatedCounselMessagesEntity = await this.counselMessagesRepository.save(counselMessagesEntity);
    const updatedCounselMessage = PsqlCounselMessagesMapper.toDomain(updatedCounselMessagesEntity);
    await this.publishDomainEvents(updatedCounselMessage);

    return updatedCounselMessage;
  }
}
