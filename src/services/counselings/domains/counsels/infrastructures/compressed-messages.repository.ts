import { CompressedMessages } from "~counselings/domains/counsels/models/compressed-messages";

import { Injectable } from "@nestjs/common";
import { CompressedMessageId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { CompressedMessagesEntity } from "~common/system/persistences/entities/counsels/compressed-messages.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

@Injectable()
export abstract class CompressedMessagesRepository {
  abstract findById(
    compressedMessageId: CompressedMessageId,
    options?: FindOneOptions<CompressedMessagesEntity>,
  ): Promise<CompressedMessages | null>;
  abstract findMany(options?: FindManyOptions<CompressedMessagesEntity>): Promise<CompressedMessages[]>;
  abstract save(compressedMessage: CompressedMessages): Promise<CompressedMessages>;
  abstract save(compressedMessages: CompressedMessages[]): Promise<CompressedMessages[]>;
}
