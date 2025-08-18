import { BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ContextReviewer } from "~counselings/domains/counsels/analyzers/context-reviewer";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Inject, Injectable, Logger } from "@nestjs/common";

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
  public async analyze(counsel: Counsels): Promise<Partial<CounselContextsProps>> {
    try {
      // 1) Light review to determine which domains to analyze
      // Build conversation JSON for reviewer
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
      if (review.shouldAnalyzeDomains.length === 0) return {};

      // 2) Run relevant analyzers in parallel
      const analyzerMap = new Map<ContextDomain, BaseDomainAnalyzer>();
      for (const a of this.analyzers) analyzerMap.set(a.domain, a);
      const tasks = review.shouldAnalyzeDomains
        .map((d) => analyzerMap.get(d))
        .filter((x): x is BaseDomainAnalyzer => !!x)
        .map((a) => a.analyze(counsel).catch(() => ({})));

      const results = await Promise.all(tasks);
      return Object.assign({}, ...results);
    } catch (error) {
      this.logger.warn(`Analyze failed for counsel ${counsel.id.getString()}: ${String(error)}`);
      return {};
    }
  }
}
