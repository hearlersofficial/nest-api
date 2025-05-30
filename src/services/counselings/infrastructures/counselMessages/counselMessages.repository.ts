import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselMessagesEntity } from "~shared/core/infrastructure/entities/counsels/CounselMessages.entity";
import { CounselMessages } from "~counselings/domains/counselMessages/models/counselMessages";

import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class CounselMessagesRepository {
  abstract findByCounselMessageId(
    counselMessageId: UniqueEntityId,
    options?: FindOneOptions<CounselMessagesEntity>,
  ): Promise<CounselMessages | null>;
  abstract findMany(options?: FindManyOptions<CounselMessagesEntity>): Promise<CounselMessages[]>;
  abstract save(counselMessage: CounselMessages): Promise<CounselMessages>;
  abstract save(counselMessages: CounselMessages[]): Promise<CounselMessages[]>;
}
