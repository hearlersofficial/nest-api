import { AnalysisResult, BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ContextReviewer } from "~counselings/domains/counsels/analyzers/context-reviewer";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Inject, Injectable, Logger } from "@nestjs/common";

export interface CounselAnalysisResult {
  updates: Partial<CounselContextsProps>;
  analysisMetrics: {
    totalAnalyzers: number;
    successfulAnalyzers: number;
    averageProcessingTime: number;
    totalProcessingTime: number;
  };
}

@Injectable()
export class CounselAnalyzer {
  constructor(
    private readonly reviewer: ContextReviewer,
    private readonly counselsReader: CounselsReader,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject("CONTEXT_DOMAIN_ANALYZERS") private readonly analyzers: BaseDomainAnalyzer[],
  ) {}

  private readonly logger = new Logger(CounselAnalyzer.name);

  /**
   * 최근 대화 히스토리를 기반으로 counsel-context 후보 값을 추정한다.
   * 필요한 값만 반환하는 부분 업데이트 형태로 돌려준다.
   */
  public async analyze(counsel: Counsels): Promise<CounselAnalysisResult> {
    const startTime = Date.now();

    try {
      // 1) Light review to determine which domains to analyze
      const messages = await this.counselsReader.findManyMessages({
        counselId: counsel.id,
        limit: 30,
        orderBy: { id: "DESC" },
      });
      const conversation = this.historyBuilder.buildHistoryFromDomain(messages);

      const review = await this.reviewer.review({
        current: counsel.counselContexts,
        conversation,
      });

      if (review.shouldAnalyzeDomains.length === 0) {
        return {
          updates: {},
          analysisMetrics: {
            totalAnalyzers: 0,
            successfulAnalyzers: 0,
            averageProcessingTime: 0,
            totalProcessingTime: Date.now() - startTime,
          },
        };
      }

      // 2) Run relevant analyzers in parallel
      const analyzerMap = new Map<ContextDomain, BaseDomainAnalyzer>();
      for (const a of this.analyzers) analyzerMap.set(a.domain, a);

      const tasks = review.shouldAnalyzeDomains
        .map((d) => analyzerMap.get(d))
        .filter((x): x is BaseDomainAnalyzer => !!x)
        .map((a) =>
          a.analyze(counsel).catch(
            (error): AnalysisResult => ({
              updates: {},
              metadata: {
                messageCount: 0,
                processingTime: 0,
                failureReason: String(error),
                quality: "POOR",
              },
            }),
          ),
        );

      if (tasks.length === 0) {
        this.logger.warn(`No analyzers found for domains: ${review.shouldAnalyzeDomains.join(", ")}`);
        return {
          updates: {},
          analysisMetrics: {
            totalAnalyzers: 0,
            successfulAnalyzers: 0,
            averageProcessingTime: 0,
            totalProcessingTime: Date.now() - startTime,
          },
        };
      }

      const results = await Promise.all(tasks);

      // 3) Aggregate results and metrics
      const allUpdates = results.map((r) => r.updates);
      const successfulResults = results.filter((r) => !r.metadata.failureReason);
      const processingTimes = results.map((r) => r.metadata.processingTime);
      const averageProcessingTime = processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length;

      this.logger.log(
        `Analysis completed: ${successfulResults.length}/${results.length} successful, ` +
          `avg time: ${averageProcessingTime.toFixed(1)}ms`,
      );

      return {
        updates: Object.assign({}, ...allUpdates),
        analysisMetrics: {
          totalAnalyzers: results.length,
          successfulAnalyzers: successfulResults.length,
          averageProcessingTime,
          totalProcessingTime: Date.now() - startTime,
        },
      };
    } catch (error) {
      this.logger.warn(`Analyze failed for counsel ${counsel.id.getString()}: ${String(error)}`);
      return {
        updates: {},
        analysisMetrics: {
          totalAnalyzers: 0,
          successfulAnalyzers: 0,
          averageProcessingTime: 0,
          totalProcessingTime: Date.now() - startTime,
        },
      };
    }
  }
}
