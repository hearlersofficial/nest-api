import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselAnalyzer } from "~counselings/domains/counsels/counsel.analyzer";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselsStore } from "~counselings/domains/counsels/counsels.store";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Inject, Injectable, Logger } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";
import { Propagation, Transactional } from "typeorm-transactional";

@Injectable()
export class ContextOrganizer {
  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly counselsStore: CounselsStore,
    private readonly historyBuilder: ConversationHistoryBuilder,
    private readonly counselAnalyzer: CounselAnalyzer,
    @Inject(ASSISTANT_AGENT)
    private readonly assistantAgent: AssistantAgent,
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
