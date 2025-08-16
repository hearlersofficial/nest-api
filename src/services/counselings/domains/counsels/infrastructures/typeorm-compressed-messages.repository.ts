import { CompressedMessagesRepository } from "~counselings/domains/counsels/infrastructures/compressed-messages.repository";
import { TypeormCompressedMessageMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-compressed-message.mapper";
import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CompressedMessagesEntity } from "~common/system/persistences/entities/counsels/compressed-messages.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";
import { Repository } from "typeorm/repository/Repository";

@Injectable()
export class TypeormCompressedMessagesRepository extends CompressedMessagesRepository {
  constructor(
    @InjectRepository(CompressedMessagesEntity)
    private readonly compressedMessagesRepository: Repository<CompressedMessagesEntity>,
  ) {
    super();
  }

  override async findById(
    compressedMessageId: CompressedMessageId,
    options?: FindOneOptions<CompressedMessagesEntity>,
  ): Promise<CompressedMessages | null> {
    const findOneOptions: FindOneOptions<CompressedMessagesEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: compressedMessageId.getString(),
    };
    const compressedMessage = await this.compressedMessagesRepository.findOne(findOneOptions);
    return compressedMessage ? TypeormCompressedMessageMapper.toDomain(compressedMessage) : null;
  }

  override async findMany(options?: FindManyOptions<CompressedMessagesEntity>): Promise<CompressedMessages[]> {
    const findManyOptions: FindManyOptions<CompressedMessagesEntity> = options ?? {};
    const compressedMessages = await this.compressedMessagesRepository.find(findManyOptions);
    return TypeormCompressedMessageMapper.toDomains(compressedMessages);
  }

  override async save(compressedMessage: CompressedMessages): Promise<CompressedMessages>;
  override async save(compressedMessages: CompressedMessages[]): Promise<CompressedMessages[]>;
  override async save(
    compressedMessages: CompressedMessages | CompressedMessages[],
  ): Promise<CompressedMessages | CompressedMessages[]> {
    if (Array.isArray(compressedMessages)) {
      await this.compressedMessagesRepository.save(TypeormCompressedMessageMapper.toEntities(compressedMessages));
      return compressedMessages;
    } else {
      const entity = TypeormCompressedMessageMapper.toEntity(compressedMessages);
      await this.compressedMessagesRepository.save(entity);
      return compressedMessages;
    }
  }
}
