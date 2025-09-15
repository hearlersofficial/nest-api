import { CounselAnalyzer } from "~counselings/domains/counsels/counsel.analyzer";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";

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
  public async organizeContext(counselContext: CounselContexts): Promise<void> {
    try {
      this.logger.log(`organizeContext: ${counselContext.counselId.getString()}`);
      const analysisResult = await this.counselAnalyzer.analyze(counselContext);

      if (Object.keys(analysisResult.updates).length > 0) {
        counselContext.applyUpdates(analysisResult.updates);
        await this.counselsStore.updateContexts(counselContext);

        this.logger.log(
          `Context updated: ${counselContext.counselId.getString()}, ` +
            `analyzers: ${analysisResult.analysisMetrics.successfulAnalyzers}/${analysisResult.analysisMetrics.totalAnalyzers}, ` +
            `time: ${analysisResult.analysisMetrics.totalProcessingTime}ms`,
        );
      } else {
        this.logger.debug(
          `No updates needed: ${counselContext.counselId.getString()}, ` +
            `time: ${analysisResult.analysisMetrics.totalProcessingTime}ms`,
        );
      }
    } catch (error) {
      this.logger.error(`organizeContext failed: ${counselContext.counselId.getString()}`, error);
      // Transaction Rollback
      throw error;
    }
  }
}
