import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
  FIELD_DESCRIPTIONS,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { CounselContexts } from "~counselings/domains/counsels/models/counsel-contexts";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

export interface ReviewResult {
  shouldAnalyzeDomains: ContextDomain[];
}

@Injectable()
export class ContextReviewer {
  constructor(@Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent) {}

  public async review(input: { current: CounselContexts; conversation: string }): Promise<ReviewResult> {
    const { current, conversation } = input;

    const payload = {
      current,
    };

    const message = this.getUserPrompt(conversation, payload);
    const response = await this.assistantAgent.call({
      conversationId: current.counselId.getString(),
      message,
      systemPrompt: this.getSystemPrompt(),
      aiModel: AiModel.GPT_5,
      temperature: 0,
      maxToolCalls: 0,
      useTools: false,
    });

    return this.pick(response.content);
  }

  private getSystemPrompt(): string {
    const domainConfigs = Object.values(CONTEXT_DOMAIN_REGISTRY);
    const domainDescriptions = domainConfigs
      .map(
        (config) =>
          `${config.domain}:
  - ${config.description}
  - Related fields: ${config.relatedFields.join(", ")}
  - ${config.analysisGuidelines}`,
      )
      .join("\n\n");

    return `You are an expert counseling context reviewer specialized in psychological assessment.

Your task is to determine which specific domains require re-analysis based on:
1. Current conversation content and emotional shifts
2. Drift from previous context snapshots
3. Evidence of meaningful change or new information

AVAILABLE DOMAINS:
${domainDescriptions}

ANALYSIS CRITERIA:
- Select domains ONLY when there is clear evidence of change, escalation, or new information
- Consider both explicit statements and implicit cues in the conversation
- Evaluate the significance of changes against current context values
- Prioritize precision over recall - avoid selecting domains without substantial evidence
- Look for patterns that suggest underlying shifts in the client's psychological state

OUTPUT FORMAT: Return only valid JSON: { "shouldAnalyzeDomains": ["DOMAIN1", "DOMAIN2"] }
Valid domains: ${Object.values(ContextDomain).join(", ")}`;
  }

  private getUserPrompt(conversation: string, payload: { current: CounselContexts }): string {
    const contextSummary = this.formatContextSummary(payload.current);

    return `Analyze the following conversation and current context to determine which domains need re-analysis:

<CONVERSATION>
${conversation}
</CONVERSATION>

<CURRENT_CONTEXT_SUMMARY>
${contextSummary}
</CURRENT_CONTEXT_SUMMARY>

Based on your analysis, identify which domains show evidence of meaningful change or new information that warrants re-analysis.

Return only JSON in the specified format.`;
  }

  private pick(content: string): ReviewResult {
    try {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      const json = JSON.parse(content.slice(start, end + 1));
      const arr = Array.isArray(json.shouldAnalyzeDomains) ? (json.shouldAnalyzeDomains as unknown[]) : [];
      const domains = arr.filter((v: unknown) => typeof v === "string") as string[];
      const set = new Set<ContextDomain>();
      for (const d of domains) {
        if (Object.values(ContextDomain).includes(d as ContextDomain)) {
          set.add(d as ContextDomain);
        }
      }
      return { shouldAnalyzeDomains: Array.from(set) };
    } catch {
      return { shouldAnalyzeDomains: [] };
    }
  }

  private formatContextSummary(context: CounselContexts): string {
    return `Current Context Analysis:

EMOTION DOMAIN:
- Primary Emotion: ${FIELD_DESCRIPTIONS.emotionPrimary.values[context.emotionPrimary] || `Unknown (${context.emotionPrimary})`}
- Valence: ${FIELD_DESCRIPTIONS.valence.values[context.valence] || `Unknown (${context.valence})`}
- Arousal Level: ${FIELD_DESCRIPTIONS.arousal.values[context.arousal] || `Unknown (${context.arousal})`}
- Emotion Intensity: ${context.emotionIntensity ?? "Not specified"}/10

RISK ASSESSMENT:
- Risk Kind: ${FIELD_DESCRIPTIONS.riskKind.values[context.riskKind] || `Unknown (${context.riskKind})`}
- Risk Severity: ${context.riskSeverity ?? "Not specified"}/3

MOTIVATION & CONTROL:
- Motivation Stage: ${FIELD_DESCRIPTIONS.motivationStage.values[context.motivationStage] || `Unknown (${context.motivationStage})`}
- Perceived Control: ${FIELD_DESCRIPTIONS.perceivedControl.values[context.perceivedControl] || `Unknown (${context.perceivedControl})`}
- Self Efficacy: ${context.selfEfficacy ?? "Not specified"}/10

SUPPORT & WELLBEING:
- Social Support: ${FIELD_DESCRIPTIONS.socialSupport.values[context.socialSupport] || `Unknown (${context.socialSupport})`}
- Sleep Quality: ${FIELD_DESCRIPTIONS.sleepQuality.values[context.sleepQuality] || `Unknown (${context.sleepQuality})`}
- Cognitive Load: ${FIELD_DESCRIPTIONS.cognitiveLoad.values[context.cognitiveLoad] || `Unknown (${context.cognitiveLoad})`}

THERAPEUTIC ALLIANCE:
- Alliance Strength: ${FIELD_DESCRIPTIONS.allianceStrength.values[context.allianceStrength] || `Unknown (${context.allianceStrength})`}
- Consent to Depth: ${context.consentToDepth ?? "Not specified"}

IMPACT & TIMEFRAME:
- Impact Domain: ${FIELD_DESCRIPTIONS.impactDomain.values[context.impactDomain] || `Unknown (${context.impactDomain})`}
- Timeframe: ${FIELD_DESCRIPTIONS.timeframe.values[context.timeframe] || `Unknown (${context.timeframe})`}

ADDITIONAL INFO:
- Physical Symptoms Present: ${context.physicalSymptomsPresent ?? "Not specified"}
- Current Technique Message Count: ${context.currentTechniqueMessageCount}
- Not Compressed Message Count: ${context.notCompressedMessageCount}`;
  }
}
