import * as TransitionRulesCriteria from "~counselings/domains/counsel-techniques/counsel-technique-transition-rules.criteria";
import { RepositoryCounselTechniqueTransitionRulesCriteriaMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-technique-transition-rules-criteria.mapper";

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";

describe("RepositoryCounselTechniqueTransitionRulesCriteriaMapper", () => {
  describe("toFindOneOptions", () => {
    it("options가 undefined이면 빈 객체를 반환한다", () => {
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(undefined);

      expect(result).toEqual({});
    });

    it("options가 null이면 빈 객체를 반환한다", () => {
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(null as any);

      expect(result).toEqual({});
    });

    it("빈 options 객체를 전달하면 빈 where 절을 반환한다", () => {
      const options: TransitionRulesCriteria.FindOneOptions = {};
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({ where: {} });
    });

    it("fromCounselTechniqueId만 있는 경우 올바른 where 절을 생성한다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const options: TransitionRulesCriteria.FindOneOptions = { fromCounselTechniqueId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
        },
      });
    });

    it("toCounselTechniqueId만 있는 경우 올바른 where 절을 생성한다", () => {
      const toCounselTechniqueId = new CounselTechniqueId();
      const options: TransitionRulesCriteria.FindOneOptions = { toCounselTechniqueId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          toCounselTechniqueId: toCounselTechniqueId.getString(),
        },
      });
    });

    it("promptVersionId만 있는 경우 올바른 where 절을 생성한다", () => {
      const promptVersionId = new PromptVersionId();
      const options: TransitionRulesCriteria.FindOneOptions = { promptVersionId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("모든 조건이 있는 경우 모든 조건을 포함한 where 절을 생성한다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const toCounselTechniqueId = new CounselTechniqueId();
      const promptVersionId = new PromptVersionId();

      const options: TransitionRulesCriteria.FindOneOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
          toCounselTechniqueId: toCounselTechniqueId.getString(),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 null인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const toCounselTechniqueId = null as any;
      const promptVersionId = new PromptVersionId();

      const options: TransitionRulesCriteria.FindOneOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 undefined인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const fromCounselTechniqueId = undefined as any;
      const toCounselTechniqueId = new CounselTechniqueId();
      const promptVersionId = undefined as any;

      const options: TransitionRulesCriteria.FindOneOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          toCounselTechniqueId: toCounselTechniqueId.getString(),
        },
      });
    });
  });

  describe("toFindManyOptions", () => {
    it("빈 criteria 객체를 전달하면 빈 where 절을 반환한다", () => {
      const criteria: TransitionRulesCriteria.FindManyOptions = {};
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({ where: {} });
    });

    it("fromCounselTechniqueId만 있는 경우 올바른 where 절을 생성한다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const criteria: TransitionRulesCriteria.FindManyOptions = { fromCounselTechniqueId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
        },
      });
    });

    it("toCounselTechniqueId만 있는 경우 올바른 where 절을 생성한다", () => {
      const toCounselTechniqueId = new CounselTechniqueId();
      const criteria: TransitionRulesCriteria.FindManyOptions = { toCounselTechniqueId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          toCounselTechniqueId: toCounselTechniqueId.getString(),
        },
      });
    });

    it("promptVersionId만 있는 경우 올바른 where 절을 생성한다", () => {
      const promptVersionId = new PromptVersionId();
      const criteria: TransitionRulesCriteria.FindManyOptions = { promptVersionId };
      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("모든 조건이 있는 경우 모든 조건을 포함한 where 절을 생성한다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const toCounselTechniqueId = new CounselTechniqueId();
      const promptVersionId = new PromptVersionId();

      const criteria: TransitionRulesCriteria.FindManyOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
          toCounselTechniqueId: toCounselTechniqueId.getString(),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 null인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const fromCounselTechniqueId = new CounselTechniqueId();
      const toCounselTechniqueId = null as any;
      const promptVersionId = new PromptVersionId();

      const criteria: TransitionRulesCriteria.FindManyOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          fromCounselTechniqueId: fromCounselTechniqueId.getString(),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 undefined인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const fromCounselTechniqueId = undefined as any;
      const toCounselTechniqueId = new CounselTechniqueId();
      const promptVersionId = undefined as any;

      const criteria: TransitionRulesCriteria.FindManyOptions = {
        fromCounselTechniqueId,
        toCounselTechniqueId,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueTransitionRulesCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          toCounselTechniqueId: toCounselTechniqueId.getString(),
        },
      });
    });
  });
});
