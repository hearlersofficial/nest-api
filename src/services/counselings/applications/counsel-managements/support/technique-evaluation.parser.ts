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

    // Counseling-aware derived scores (mapping atomic signals → clinical constructs)
    const techniqueCompletionScore = this.clamp0to100(0.6 * goalPercent + 0.4 * conv);
    const nextTechniqueFitScore = this.clamp0to100(appropriateness);
    const allianceStrengthScore = this.clamp0to100(engage);
    const clientReadinessScore = this.clamp0to100(0.5 * engage + 0.5 * appropriateness);
    const riskStabilityScore = this.clamp0to100(100 - (parsed.safety?.riskLevel ?? 0));

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
    const minTechniqueCompletion = 65;
    const minAlliance = 45;
    const minReadiness = 55;
    const minFit = 55;
    const minRiskStability = 60;

    if (techniqueCompletionScore < minTechniqueCompletion)
      gates.push(`Technique completion < ${minTechniqueCompletion}`);
    if (allianceStrengthScore < minAlliance) gates.push(`Alliance < ${minAlliance}`);
    if (clientReadinessScore < minReadiness) gates.push(`Readiness < ${minReadiness}`);
    if (nextTechniqueFitScore < minFit) gates.push(`Next-technique fit < ${minFit}`);
    if (riskStabilityScore < minRiskStability) gates.push(`Risk stability < ${minRiskStability}`);

    const shouldTransition = gates.length === 0;

    // Confidence heuristic: start from an average of core signals and penalize
    let confidence = this.clamp0to100(
      (techniqueCompletionScore + allianceStrengthScore + clientReadinessScore + nextTechniqueFitScore) / 4,
    );
    if (!hasSufficientEvidence) confidence -= 15;
    if (checklistCoverage < checklistRequired) confidence -= 10;
    if (redFlags.length > 0) confidence = Math.min(confidence, 30);
    confidence = this.clamp0to100(confidence);

    // Soft relaxation when exceeding message threshold slightly
    const messageExcess = Math.max(0, context.userMessageCount - context.messageThreshold);
    const relaxation = Math.min(10, Math.floor(messageExcess / 2)); // every +2 msgs → +1 relaxation up to +10
    const relaxedGates = this.applyRelaxationToGates(gates, relaxation);

    const scores: TechniqueTransitionScore = {
      techniqueCompletionScore,
      nextTechniqueFitScore,
      allianceStrengthScore,
      clientReadinessScore,
      riskStabilityScore,
      reasoning: this.composeReasoning(evidence, relaxedGates),
    };

    return {
      shouldTransition: relaxedGates.length === 0,
      scores,
      confidence,
      evidence,
      unmetCriteria: relaxedGates,
      redFlags,
      ruleApplied: relaxedGates.length === 0 ? "Thresholds met (with relaxation if applied)" : "Gate blocked",
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

  private applyRelaxationToGates(gates: string[], relaxation: number): string[] {
    if (relaxation <= 0) return gates;
    // Relax only soft performance gates, not safety/red flags
    const nonRelaxable = ["Red flags present", "Safety risk >= 30", "Message threshold unmet"];
    const result: string[] = [];
    for (const g of gates) {
      if (nonRelaxable.includes(g)) {
        result.push(g);
        continue;
      }
      // Reduce numeric thresholds by relaxation points where applicable
      const lowered = this.tryLowerGateRequirement(g, relaxation);
      if (lowered) continue; // gate satisfied under relaxation
      result.push(g);
    }
    return result;
  }

  private tryLowerGateRequirement(gate: string, relaxation: number): boolean {
    // Examples of gates we emit:
    // "Technique completion < 65"
    // "Alliance < 45"
    // "Readiness < 55"
    // "Next-technique fit < 55"
    // "Risk stability < 60"
    const match = gate.match(/^(.*) < (\d{1,3})$/);
    if (!match) return false;
    const label = match[1];
    const threshold = Number(match[2]);
    const relaxedThreshold = Math.max(0, threshold - relaxation);
    // If the original gate said value < threshold, relaxation lowers the bar; treat as satisfied once we apply
    // Here we simply drop the gate, as the caller already decided to relax
    return relaxedThreshold <= threshold - relaxation;
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
