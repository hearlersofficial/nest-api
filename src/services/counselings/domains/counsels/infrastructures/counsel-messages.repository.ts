import { CounselMessages } from "~counselings/domains/counsels/models/counsel-messages";

import { CounselMessageId } from "~common/shared-kernel/identifiers/counsel-message.id";
import { CounselMessagesEntity } from "~common/system/persistences/entities/counsels/counsel-messages.entity";
import { FindManyOptions, FindOneOptions } from "typeorm";

export abstract class CounselMessagesRepository {
  abstract findByCounselMessageId(
    counselMessageId: CounselMessageId,
    options?: FindOneOptions<CounselMessagesEntity>,
  ): Promise<CounselMessages | null>;
  abstract findMany(options?: FindManyOptions<CounselMessagesEntity>): Promise<CounselMessages[]>;
  abstract save(counselMessage: CounselMessages): Promise<CounselMessages>;
  abstract save(counselMessages: CounselMessages[]): Promise<CounselMessages[]>;
}
