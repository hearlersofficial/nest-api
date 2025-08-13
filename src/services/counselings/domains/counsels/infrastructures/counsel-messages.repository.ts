import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";

import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/CounselMessages.entity";
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
