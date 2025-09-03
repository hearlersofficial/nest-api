import { CounselAnalyzer } from "~counselings/domains/counsels/counsel.analyzer";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable, Logger } from "@nestjs/common";
import { Propagation, Transactional } from "typeorm-transactional";

@Injectable()
export class ContextOrganizer {
  constructor(
    private readonly counselsStore: CounselsStore,
    private readonly counselAnalyzer: CounselAnalyzer,
  ) {}

  private readonly logger = new Logger(ContextOrganizer.name);

  @Transactional({ propagation: Propagation.REQUIRES_NEW })
  public organizeContext(counsel: Counsels): void {
    Promise.resolve()
      .then(async () => {
        this.logger.log(`[ContextOrganizer] organizeContext: ${counsel.id.getString()}`);
        const updates = await this.counselAnalyzer.analyze(counsel);
        if (Object.keys(updates).length > 0) {
          counsel.counselContexts.applyUpdates(updates);
          await this.counselsStore.update(counsel);
        }
        return;
      })
      .catch((error) => {
        this.logger.error(`[ContextOrganizer] organizeContext failed: ${counsel.id.getString()}`, error);
      });
  }
}
