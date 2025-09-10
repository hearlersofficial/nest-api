import * as CounselTechniqueTransitionRulesCriteria from "~counselings/domains/counsel-techniques/counsel-technique-transition-rules.criteria";
import * as CounselTechniquesCriteria from "~counselings/domains/counsel-techniques/counsel-techniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counsel-techniques/counsel-techniques.reader";
import { CounselTechniquesStore } from "~counselings/domains/counsel-techniques/counsel-techniques.store";
import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { CounselTechniqueTransitionRuleInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rule.info";
import {
  CounselTechniqueTransitionRulesNewProps,
  CounselTechniqueTransitionRulesProps,
} from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";
import { CounselTechniquesNewProps } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { isDefined } from "~common/shared/utils/validate";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselTechniquesService {
  constructor(
    private readonly counselTechniquesReader: CounselTechniquesReader,
    private readonly counselTechniquesStore: CounselTechniquesStore,
  ) {}

  @Transactional()
  async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniqueInfo> {
    if (newProps.isStartTechnique) {
      const startTechnique = await this.counselTechniquesReader.findOne({
        uniqueCriteria: {
          type: "startTechnique",
          toneId: newProps.toneId,
          promptVersionId: newProps.promptVersionId,
        },
      });
      if (isDefined(startTechnique)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Start technique already exists");
      }
    }
    const counselTechnique = await this.counselTechniquesStore.create(newProps);
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  async getOne(props: {
    uniqueCriteria: CounselTechniquesCriteria.UniqueKey;
    options?: CounselTechniquesCriteria.FindOneOptions;
  }): Promise<CounselTechniqueInfo> {
    const { uniqueCriteria, options } = props;
    const counselTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria,
      options,
    });
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  @Transactional()
  async updateCounselTechnique(props: {
    counselTechniqueId: CounselTechniqueId;
    name?: string;
    temperature?: number;
    context?: string;
    instruction?: string;
    isStartTechnique?: boolean;
  }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId, name, temperature, context, instruction, isStartTechnique } = props;
    const originalTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria: { type: "counselTechnique", id: counselTechniqueId },
    });
    if (!originalTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel technique not found");
    }

    if (isStartTechnique) {
      const startTechnique = await this.counselTechniquesReader.findOne({
        uniqueCriteria: {
          type: "startTechnique",
          toneId: originalTechnique.toneId,
          promptVersionId: originalTechnique.promptVersionId,
        },
      });
      if (isDefined(startTechnique) && !startTechnique.id.equals(counselTechniqueId)) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Start technique already exists");
      }
    }

    originalTechnique.update({
      name: name ?? originalTechnique.name,
      temperature: temperature ?? originalTechnique.temperature,
      context: context ?? originalTechnique.context,
      instruction: instruction ?? originalTechnique.instruction,
      isStartTechnique: isStartTechnique ?? originalTechnique.isStartTechnique,
    });
    await this.counselTechniquesStore.update(originalTechnique);

    return CounselTechniqueInfo.fromDomain(originalTechnique);
  }

  async findMany(props: CounselTechniquesCriteria.FindManyOptions): Promise<CounselTechniqueInfo[]> {
    const counselTechniques = await this.counselTechniquesReader.findMany(props);
    return counselTechniques.map((counselTechnique) => CounselTechniqueInfo.fromDomain(counselTechnique));
  }

  @Transactional()
  async createTransitionRule(
    newProps: CounselTechniqueTransitionRulesNewProps,
  ): Promise<CounselTechniqueTransitionRuleInfo> {
    const { promptVersionId, fromCounselTechniqueId, toCounselTechniqueId } = newProps;
    const [fromCounselTechnique, toCounselTechnique] = await Promise.all([
      this.getOne({
        uniqueCriteria: { type: "counselTechnique", id: fromCounselTechniqueId },
      }),
      this.getOne({
        uniqueCriteria: { type: "counselTechnique", id: toCounselTechniqueId },
      }),
    ]);

    const transitionRule = await this.counselTechniquesStore.createTransitionRule(newProps);
    return CounselTechniqueTransitionRuleInfo.fromDomain(transitionRule);
  }

  @Transactional()
  async updateTransitionRule(
    props: Partial<
      Omit<CounselTechniqueTransitionRulesProps, "promptVersionId" | "createdAt" | "updatedAt" | "deletedAt">
    > & {
      counselTechniqueTransitionRuleId: CounselTechniqueTransitionRuleId;
    },
  ): Promise<CounselTechniqueTransitionRuleInfo> {
    const { counselTechniqueTransitionRuleId } = props;
    const originalTransitionRule = await this.counselTechniquesReader.findOneTransitionRule({
      uniqueCriteria: {
        type: "counselTechniqueTransitionRule",
        id: counselTechniqueTransitionRuleId,
      },
    });
    if (!originalTransitionRule) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Transition rule not found");
    }

    originalTransitionRule.update(props);
    await this.counselTechniquesStore.updateTransitionRule(originalTransitionRule);
    return CounselTechniqueTransitionRuleInfo.fromDomain(originalTransitionRule);
  }

  @Transactional()
  async deleteTransitionRule(counselTechniqueTransitionRuleId: CounselTechniqueTransitionRuleId): Promise<void> {
    const originalTransitionRule = await this.counselTechniquesReader.findOneTransitionRule({
      uniqueCriteria: { type: "counselTechniqueTransitionRule", id: counselTechniqueTransitionRuleId },
    });
    if (!originalTransitionRule) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Transition rule not found");
    }

    originalTransitionRule.delete();
    await this.counselTechniquesStore.updateTransitionRule(originalTransitionRule);
  }

  async getOneTransitionRule(props: {
    uniqueCriteria: CounselTechniqueTransitionRulesCriteria.UniqueKey;
    options?: CounselTechniqueTransitionRulesCriteria.FindOneOptions;
  }): Promise<CounselTechniqueTransitionRuleInfo> {
    const { uniqueCriteria, options } = props;
    const transitionRule = await this.counselTechniquesReader.findOneTransitionRule({ uniqueCriteria, options });
    if (!transitionRule) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Transition rule not found");
    }
    return CounselTechniqueTransitionRuleInfo.fromDomain(transitionRule);
  }

  async findManyTransitionRules(
    props: CounselTechniqueTransitionRulesCriteria.FindManyOptions,
  ): Promise<CounselTechniqueTransitionRuleInfo[]> {
    const transitionRules = await this.counselTechniquesReader.findManyTransitionRules(props);
    return transitionRules.map((transitionRule) => CounselTechniqueTransitionRuleInfo.fromDomain(transitionRule));
  }
}
