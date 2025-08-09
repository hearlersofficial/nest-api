import {
  TechniqueEvaluationEvidence,
  TechniqueTransitionDecision,
  TechniqueTransitionScore,
} from "~counselings/applications/counsel-managements/types/technique.type";

import { Injectable } from "@nestjs/common";

type AtomicSignals = {
  conversationProgress?: number;
  userEngagement?: number;
  goalAchievement?: { percentMet?: number; checklist?: Array<{ name?: string; met?: boolean; quote?: string }> };
  appropriateness?: number;
};

type AtomicEval = {
  signals?: AtomicSignals;
  evidence?: Array<{ quote?: string; tag?: string }>;
  redFlags?: string[];
  safety?: { riskLevel?: number };
};

type EvalContext = {
  messageThreshold: number;
  userMessageCount: number;
};

@Injectable()
export class TechniqueEvaluationParser {
  parseTechniqueEvaluationResponse(response: string, context: EvalContext): TechniqueTransitionDecision {
    const parsed = this.safeParse(response);

    const signals = parsed.signals || {};
    const conv = this.clamp0to100(signals.conversationProgress ?? 0);
    const engage = this.clamp0to100(signals.userEngagement ?? 0);
    const goalPercent = this.clamp0to100(signals.goalAchievement?.percentMet ?? 0);
    const checklist = Array.isArray(signals.goalAchievement?.checklist) ? signals.goalAchievement!.checklist! : [];
    const appropriateness = this.clamp0to100(signals.appropriateness ?? 0);

    const redFlags: string[] = Array.isArray(parsed.redFlags) ? parsed.redFlags : [];
    const safetyRisk = this.clamp0to100(parsed.safety?.riskLevel ?? 0);

    const evidence: TechniqueEvaluationEvidence[] = Array.isArray(parsed.evidence)
      ? parsed.evidence
          .map((e) => ({ quote: String(e?.quote || ""), rationale: this.inferRationaleTag(e?.tag) }))
          .filter((e) => e.quote.length > 0)
      : [];

    // Deterministic aggregation
    const weightedOverall = this.computeWeightedOverall(conv, engage, goalPercent, appropriateness);

    const checklistTotal = checklist.length || 0;
    const checklistMet = checklist.filter((c) => Boolean(c?.met)).length;
    const checklistCoverage = checklistTotal > 0 ? (100 * checklistMet) / checklistTotal : goalPercent;

    // Hard gates
    const gates: string[] = [];
    if (redFlags.length > 0) gates.push("Red flags present");
    if (safetyRisk >= 30) gates.push("Safety risk >= 30");
    if (context.userMessageCount < context.messageThreshold) gates.push("Message threshold unmet");

    // Soft requirements
    const evidenceCount = evidence.length;
    const hasSufficientEvidence = evidenceCount >= 2;
    if (!hasSufficientEvidence) gates.push("Insufficient evidence (<2 quotes)");

    const checklistRequired = 65; // require >=65% of checklist items met
    if (checklistCoverage < checklistRequired) gates.push(`Checklist coverage < ${checklistRequired}%`);

    // Score thresholds
    const minOverall = 70;
    const minEngagement = 50;
    const minGoal = 60;
    if (weightedOverall < minOverall) gates.push(`Overall < ${minOverall}`);
    if (engage < minEngagement) gates.push(`Engagement < ${minEngagement}`);
    if (goalPercent < minGoal) gates.push(`Goal < ${minGoal}`);

    const shouldTransition = gates.length === 0;

    // Confidence heuristic (derived, not from model): start at overall and penalize
    let confidence = weightedOverall;
    if (!hasSufficientEvidence) confidence -= 15;
    if (checklistCoverage < checklistRequired) confidence -= 10;
    if (redFlags.length > 0) confidence = Math.min(confidence, 30);
    confidence = this.clamp0to100(confidence);

    const scores: TechniqueTransitionScore = {
      conversationProgressScore: conv,
      userEngagementScore: engage,
      goalAchievementScore: goalPercent,
      appropriatenessScore: appropriateness,
      overallScore: weightedOverall,
      reasoning: this.composeReasoning(evidence, gates),
    };

    return {
      shouldTransition,
      scores,
      confidence,
      evidence,
      unmetCriteria: gates,
      redFlags,
      ruleApplied: shouldTransition ? "Deterministic thresholds met" : "Gate blocked",
    };
  }

  private safeParse(response: string): AtomicEval {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return {};
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {};
    }
  }

  private computeWeightedOverall(conv: number, engage: number, goal: number, appropr: number): number {
    const raw = 0.35 * conv + 0.25 * engage + 0.3 * goal + 0.1 * appropr;
    return this.clamp0to100(raw);
  }

  private clamp0to100(n: number): number {
    if (isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  private inferRationaleTag(tag?: string): string {
    switch ((tag || "").toLowerCase()) {
      case "progress":
        return "Supports conversation progress";
      case "engagement":
        return "Indicates user engagement";
      case "goal":
        return "Relates to goal achievement";
      case "appropriateness":
        return "Relates to appropriateness";
      default:
        return "Quoted evidence";
    }
  }

  private composeReasoning(evidence: TechniqueEvaluationEvidence[], gates: string[]): string {
    const ev = evidence
      .slice(0, 2)
      .map((e) => e.quote)
      .join(" | ");
    const gateInfo = gates.length > 0 ? `Blocked by: ${gates.join(", ")}` : "All thresholds satisfied";
    return `${gateInfo}${ev ? ` | Evidence: ${ev}` : ""}`;
  }
}
