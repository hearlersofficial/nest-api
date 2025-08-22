import { CounselMessagesRepository } from "~counselings/domains/counsels/infrastructures/counsel-messages.repository";
import { TypeormCounselMessagesMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-counsel-messages.mapper";
import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";

import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { KAFKA_CLIENT } from "~common/system/persistences/client-config";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/counsel-messages.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormCounselMessagesRepository extends CounselMessagesRepository {
  constructor(
    @InjectRepository(CounselMessagesEntity)
    private readonly counselMessagesRepository: Repository<CounselMessagesEntity>,
    @Inject(KAFKA_CLIENT) private readonly kafkaClient: ClientKafka,
  ) {
    super();
  }

  private publishDomainEvent(message: CounselMessages): void {
    message.domainEvents.forEach((event) => {
      this.kafkaClient.emit(event.topic, event.binary);
    });
  }

  override async findByCounselMessageId(
    counselMessageId: CounselMessageId,
    options?: FindOneOptions<CounselMessagesEntity>,
  ): Promise<CounselMessages | null> {
    const findOneOptions: FindOneOptions<CounselMessagesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselMessageId.getString(),
    };

    const message = await this.counselMessagesRepository.findOne(findOneOptions);
    return message ? TypeormCounselMessagesMapper.toDomain(message) : null;
  }

  override async findMany(options?: FindManyOptions<CounselMessagesEntity>): Promise<CounselMessages[]> {
    const findManyOptions: FindManyOptions<CounselMessagesEntity> = options ?? {};
    findManyOptions.order = {
      ...findManyOptions.order,
      createdAt: "ASC",
    };
    const messages = await this.counselMessagesRepository.find(findManyOptions);
    return TypeormCounselMessagesMapper.toDomains(messages);
  }

  override async save(message: CounselMessages): Promise<CounselMessages>;
  override async save(messages: CounselMessages[]): Promise<CounselMessages[]>;
  async save(message: CounselMessages | CounselMessages[]): Promise<CounselMessages | CounselMessages[]> {
    if (Array.isArray(message)) {
      await this.counselMessagesRepository.save(TypeormCounselMessagesMapper.toEntities(message));
      return message;
    } else {
      const messageEntity = TypeormCounselMessagesMapper.toEntity(message);
      await this.counselMessagesRepository.save(messageEntity);
      this.publishDomainEvent(message);
      return message;
    }
  }
}
