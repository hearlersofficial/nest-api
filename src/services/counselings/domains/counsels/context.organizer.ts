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
  public async organizeContext(counsel: Counsels): Promise<void> {
    try {
      this.logger.log(`organizeContext: ${counsel.id.getString()}`);
      const analysisResult = await this.counselAnalyzer.analyze(counsel);

      if (Object.keys(analysisResult.updates).length > 0) {
        counsel.counselContexts.applyUpdates(analysisResult.updates);
        await this.counselsStore.update(counsel);

        this.logger.log(
          `Context updated: ${counsel.id.getString()}, ` +
            `analyzers: ${analysisResult.analysisMetrics.successfulAnalyzers}/${analysisResult.analysisMetrics.totalAnalyzers}, ` +
            `time: ${analysisResult.analysisMetrics.totalProcessingTime}ms`,
        );
      } else {
        this.logger.debug(
          `No updates needed: ${counsel.id.getString()}, ` +
            `time: ${analysisResult.analysisMetrics.totalProcessingTime}ms`,
        );
      }
    } catch (error) {
      this.logger.error(`organizeContext failed: ${counsel.id.getString()}`, error);
      // Transaction Rollback
      throw error;
    }
  }
}
