import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";

import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselContextId } from "~common/shared-kernel/identifiers/counsel-context.id";
import { FindManyOptions, Repository } from "typeorm";

export abstract class CounselContextsRepository {
  abstract findById(counselContextId: CounselContextId): Promise<CounselContexts | null>;
  abstract findByCounselId(counselId: CounselId): Promise<CounselContexts | null>;
  abstract save(counselContext: CounselContexts): Promise<CounselContexts>;
  abstract save(counselContexts: CounselContexts[]): Promise<CounselContexts[]>;
}
