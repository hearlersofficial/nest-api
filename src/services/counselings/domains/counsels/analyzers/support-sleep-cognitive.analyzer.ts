import { AnalyzerValidator } from "~counselings/domains/counsels/analyzers/analyzer.validator";
import { AnalysisResult, BaseDomainAnalyzer } from "~counselings/domains/counsels/analyzers/context-analyzer.interface";
import {
  CONTEXT_DOMAIN_REGISTRY,
  ContextDomain,
  FIELD_DESCRIPTIONS,
} from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { ConversationHistoryBuilder } from "~counselings/domains/counsels/conversation-history.builder";
import { CounselsReader } from "~counselings/domains/counsels/counsels.reader";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { CognitiveLoad, SleepQuality, SocialSupportLevel } from "~proto/com/hearlers/v1/model/counsel_pb";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { Inject, Injectable } from "@nestjs/common";
import { AssistantAgent } from "~common/support/assistant-agents/assistant-agent";
import { ASSISTANT_AGENT } from "~common/support/assistant-agents/assistant-agent.tokens";

@Injectable()
export class SupportSleepCognitiveAnalyzer extends BaseDomainAnalyzer {
  public readonly domain = ContextDomain.SUPPORT_SLEEP_COGNITIVE;

  constructor(
    private readonly counselsReader: CounselsReader,
    private readonly historyBuilder: ConversationHistoryBuilder,
    @Inject(ASSISTANT_AGENT) private readonly assistantAgent: AssistantAgent,
  ) {
    super();
  }

  async analyze(counsel: Counsels): Promise<AnalysisResult> {
    const startTime = Date.now();
    const messages = await this.counselsReader.findManyMessages({
      counselId: counsel.id,
      limit: 20,
      orderBy: { id: "DESC" },
    });

    if (!messages.length) {
      return this.createFailureResult("No messages found", 0, Date.now() - startTime);
    }

    try {
      const conversationJson = this.historyBuilder.buildHistoryFromDomain(messages);
      const response = await this.assistantAgent.call({
        conversationId: counsel.id.toString(),
        message: this.getUserPrompt(conversationJson),
        systemPrompt: this.getSystemPrompt(),
        aiModel: AiModel.GPT_5,
        temperature: 0,
        maxToolCalls: 0,
        useTools: false,
      });

      const updates = this.pick(response.content);
      const processingTime = Date.now() - startTime;
      const quality = this.assessQuality(updates, response.content);

      return this.createResult(updates, messages.length, processingTime, quality);
    } catch (error) {
      return this.createFailureResult(
        error instanceof Error ? error.message : "Unknown error",
        messages.length,
        Date.now() - startTime,
      );
    }
  }

  private getSystemPrompt(): string {
    const config = CONTEXT_DOMAIN_REGISTRY[ContextDomain.SUPPORT_SLEEP_COGNITIVE];
    const socialSupportOptions = AnalyzerValidator.formatFieldOptions("socialSupport");
    const sleepQualityOptions = AnalyzerValidator.formatFieldOptions("sleepQuality");
    const cognitiveLoadOptions = AnalyzerValidator.formatFieldOptions("cognitiveLoad");
    const physicalSymptomsOptions = AnalyzerValidator.formatFieldOptions("physicalSymptomsPresent");

    return `You are an expert assessor of environmental and physiological context (social support, sleep hygiene, cognitive load), using CBT/behavioral activation cues.

DOMAIN ANALYSIS:
${config.description}

RELATED FIELDS: ${config.relatedFields.join(", ")}

ANALYSIS GUIDELINES:
${config.analysisGuidelines}

SOCIAL SUPPORT LEVEL OPTIONS:
${socialSupportOptions}

SLEEP QUALITY OPTIONS:
${sleepQualityOptions}

COGNITIVE LOAD OPTIONS:
${cognitiveLoadOptions}

PHYSICAL SYMPTOMS:
${physicalSymptomsOptions}

ASSESSMENT CRITERIA:
- Social support: Availability of family, friends, professional help
- Sleep patterns: Quality, duration, disturbances, sleep hygiene
- Cognitive load: Mental demands, multitasking, decision fatigue
- Physical symptoms: Headaches, fatigue, pain, tension, etc.

OUTPUT FORMAT: Return only valid JSON with available fields:
{
  "socialSupport": <SocialSupportLevel_enum_value>,
  "sleepQuality": <SleepQuality_enum_value>,
  "cognitiveLoad": <CognitiveLoad_enum_value>,
  "physicalSymptomsPresent": <boolean_or_null>
}

Rules:
- Use exact enum values: SocialSupportLevel (${Object.keys(FIELD_DESCRIPTIONS.socialSupport.values).join(", ")}), SleepQuality (${Object.keys(FIELD_DESCRIPTIONS.sleepQuality.values).join(", ")}), CognitiveLoad (${Object.keys(FIELD_DESCRIPTIONS.cognitiveLoad.values).join(", ")})
- Only include fields you can confidently assess from the conversation
- If evidence is insufficient, omit that field entirely`;
  }

  private getUserPrompt(conversationJson: string): string {
    return `
<CONVERSATION>
${conversationJson}
</CONVERSATION>

Return ONLY JSON.`;
  }

  private pick(content: string): Partial<CounselContextsProps> {
    try {
      const json = AnalyzerValidator.extractJsonFromContent(content);
      const result: Partial<CounselContextsProps> = {};

      AnalyzerValidator.validateEnumField(json, result, { key: "socialSupport", enumType: SocialSupportLevel });
      AnalyzerValidator.validateEnumField(json, result, { key: "sleepQuality", enumType: SleepQuality });
      AnalyzerValidator.validateEnumField(json, result, { key: "cognitiveLoad", enumType: CognitiveLoad });
      AnalyzerValidator.validateBooleanField(json, result, { key: "physicalSymptomsPresent" });

      return result;
    } catch {
      return {};
    }
  }
}
