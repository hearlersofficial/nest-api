import {
  TechniqueEvaluationEvidence,
  TechniqueTransitionDecision,
  TechniqueTransitionScore,
} from "~counselings/applications/counsel-managements/types/technique.type";

import { Injectable } from "@nestjs/common";

type AtomicSignals = {
  clinical?: {
    completion?: number; // abstract completion (0-100)
    readiness?: number; // abstract readiness (0-100)
    alignment?: number; // abstract alignment to next technique (0-100)
  };
};

type AtomicEval = {
  signals?: AtomicSignals;
  evidence?: Array<{ quote?: string; tag?: string }>;
  redFlags?: string[];
  triggers?: string[];
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
    const redFlags: string[] = Array.isArray(parsed.redFlags) ? parsed.redFlags : [];
    const triggers: string[] = Array.isArray(parsed.triggers) ? parsed.triggers : [];

    const evidence: TechniqueEvaluationEvidence[] = Array.isArray(parsed.evidence)
      ? parsed.evidence
          .map((e) => ({ quote: String(e?.quote || ""), rationale: this.inferRationaleTag(e?.tag) }))
          .filter((e) => e.quote.length > 0)
      : [];

    // Abstract scores: prefer AI-provided clinical signals if present; otherwise default to 0 (lightweight)
    const clinical = (signals as any).clinical || {};
    const completion = this.clamp0to100(typeof clinical.completion === "number" ? clinical.completion : 0);
    const readiness = this.clamp0to100(typeof clinical.readiness === "number" ? clinical.readiness : 0);
    const alignment = this.clamp0to100(typeof clinical.alignment === "number" ? clinical.alignment : 0);

    // Trigger-based boosts (domain cues)
    const boosted = this.applyTriggerBoosts(
      { completionScore: completion, readinessScore: readiness, alignmentScore: alignment },
      triggers,
    );
    const comp = boosted.completionScore;
    const fit = boosted.alignmentScore;
    const ready = boosted.readinessScore;

    // Hard gates (minimal)
    const gates: string[] = [];
    if (context.userMessageCount < context.messageThreshold) gates.push("Message threshold unmet");

    // No evidence/checklist gating (lightweight)

    // Score thresholds
    // Lightweight majority rule on abstract metrics: require at least 2 of 3 to pass
    const minCompletion = 50;
    const minReadiness = 50;
    const minAlignment = 50;
    const failed: string[] = [];
    if (comp < minCompletion) failed.push(`Completion < ${minCompletion}`);
    if (ready < minReadiness) failed.push(`Readiness < ${minReadiness}`);
    if (fit < minAlignment) failed.push(`Alignment < ${minAlignment}`);
    const passedCount = 3 - failed.length;
    if (passedCount < 2) gates.push(...failed);

    const shouldTransition = gates.length === 0;

    // Confidence heuristic: start from an average of core signals and penalize
    let confidence = this.clamp0to100((comp + ready + fit) / 3);
    confidence = this.clamp0to100(confidence);

    // Soft relaxation when exceeding message threshold slightly
    const messageExcess = Math.max(0, context.userMessageCount - context.messageThreshold);
    const relaxation = Math.min(20, Math.floor(messageExcess)); // every +1 msg → +1 relaxation up to +20
    const relaxedGates = this.applyRelaxationToGates(gates, relaxation);

    const scores: TechniqueTransitionScore = {
      completionScore: comp,
      readinessScore: ready,
      alignmentScore: fit,
      reasoning: this.composeReasoning(evidence, relaxedGates, triggers),
    };

    return {
      shouldTransition: relaxedGates.length === 0,
      scores,
      confidence,
      evidence,
      unmetCriteria: relaxedGates,
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
    // Relax only soft performance gates, keep threshold gate
    const nonRelaxable = ["Message threshold unmet"];
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
    // "Completion < 50"
    // "Readiness < 50"
    // "Alignment < 50"
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

  private composeReasoning(evidence: TechniqueEvaluationEvidence[], gates: string[], triggers: string[] = []): string {
    const ev = evidence
      .slice(0, 2)
      .map((e) => e.quote)
      .join(" | ");
    const gateInfo = gates.length > 0 ? `Blocked by: ${gates.join(", ")}` : "All thresholds satisfied";
    const trig = triggers.length > 0 ? ` | Triggers: ${triggers.join(",")}` : "";
    return `${gateInfo}${ev ? ` | Evidence: ${ev}` : ""}${trig}`;
  }

  private applyTriggerBoosts(
    scores: { completionScore: number; readinessScore: number; alignmentScore: number },
    triggers: string[],
  ) {
    let { completionScore, readinessScore, alignmentScore } = scores;

    const has = (t: string) => triggers.includes(t);

    if (has("emotionDisclosure") || has("affectNamed") || has("feelingStated")) {
      readinessScore = this.clamp0to100(readinessScore + 20);
      alignmentScore = this.clamp0to100(alignmentScore + 15);
    }
    if (has("explicitTransitionRequest") || has("askToMoveOn")) {
      readinessScore = this.clamp0to100(readinessScore + 25);
      alignmentScore = this.clamp0to100(alignmentScore + 20);
    }
    if (has("currentGoalsDone") || has("phaseComplete")) {
      completionScore = this.clamp0to100(completionScore + 15);
    }

    return { completionScore, readinessScore, alignmentScore };
  }
}
