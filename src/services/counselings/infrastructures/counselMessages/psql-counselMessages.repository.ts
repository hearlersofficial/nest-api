import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";
import { CounselMessagesRepository } from "~counselings/infrastructures/counselMessages/counselMessages.repository";
import { PsqlCounselMessagesMapper } from "~counselings/infrastructures/counselMessages/mappers/psql.counselMessages.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlCounselMessagesRepository extends CounselMessagesRepository {
  constructor(
    @InjectRepository(CounselMessagesEntity)
    private readonly counselMessagesRepository: Repository<CounselMessagesEntity>,
  ) {
    super();
  }

  override async findByCounselMessageId(counselMessageId: UniqueEntityId, options?: FindOneOptions<CounselMessagesEntity>): Promise<CounselMessages | null> {
    const findOneOptions: FindOneOptions<CounselMessagesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselMessageId.getString(),
    };
    const message = await this.counselMessagesRepository.findOne(findOneOptions);
    return message ? PsqlCounselMessagesMapper.toDomain(message) : null;
  }

  override async findMany(options?: FindManyOptions<CounselMessagesEntity>): Promise<CounselMessages[]> {
    const findManyOptions: FindManyOptions<CounselMessagesEntity> = options ?? {};
    findManyOptions.order = {
      ...findManyOptions.order,
      createdAt: "ASC",
    };
    const messages = await this.counselMessagesRepository.find(findManyOptions);
    return PsqlCounselMessagesMapper.toDomains(messages);
  }

  override async save(message: CounselMessages): Promise<CounselMessages>;
  override async save(messages: CounselMessages[]): Promise<CounselMessages[]>;
  async save(message: CounselMessages | CounselMessages[]): Promise<CounselMessages | CounselMessages[]> {
    if (Array.isArray(message)) {
      await this.counselMessagesRepository.save(PsqlCounselMessagesMapper.toEntities(message));
      return message;
    } else {
      const messageEntity = PsqlCounselMessagesMapper.toEntity(message);
      await this.counselMessagesRepository.save(messageEntity);
      return message;
    }
  }
}
