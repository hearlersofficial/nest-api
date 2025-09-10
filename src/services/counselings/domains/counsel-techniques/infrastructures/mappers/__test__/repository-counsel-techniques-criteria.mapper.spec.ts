import * as CounselTechniquesCriteria from "~counselings/domains/counsel-techniques/counsel-techniques.criteria";
import { RepositoryCounselTechniqueCriteriaMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/repository-counsel-techniques-criteria.mapper";

import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { In } from "typeorm";

describe("RepositoryCounselTechniqueCriteriaMapper", () => {
  describe("toFindOneOptions", () => {
    it("options가 undefined이면 빈 객체를 반환한다", () => {
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(undefined);

      expect(result).toEqual({});
    });

    it("options가 null이면 빈 객체를 반환한다", () => {
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(null as any);

      expect(result).toEqual({});
    });

    it("빈 options 객체를 전달하면 빈 where 절을 반환한다", () => {
      const options: CounselTechniquesCriteria.FindOneOptions = {};
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({ where: {} });
    });

    it("toneId만 있는 경우 올바른 where 절을 생성한다", () => {
      const toneId = new ToneId();
      const options: CounselTechniquesCriteria.FindOneOptions = { toneId };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({
        where: {
          toneId: toneId.getString(),
        },
      });
    });

    it("toneId가 null인 경우 where 절에 포함되지 않는다", () => {
      const options: CounselTechniquesCriteria.FindOneOptions = { toneId: null as any };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({ where: {} });
    });

    it("toneId가 undefined인 경우 where 절에 포함되지 않는다", () => {
      const options: CounselTechniquesCriteria.FindOneOptions = { toneId: undefined as any };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindOneOptions(options);

      expect(result).toEqual({ where: {} });
    });
  });

  describe("toFindManyOptions", () => {
    it("빈 criteria 객체를 전달하면 빈 where 절을 반환한다", () => {
      const criteria: CounselTechniquesCriteria.FindManyOptions = {};
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({ where: {} });
    });

    it("name만 있는 경우 올바른 where 절을 생성한다", () => {
      const name = "test-technique";
      const criteria: CounselTechniquesCriteria.FindManyOptions = { name };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          name,
        },
      });
    });

    it("toneId만 있는 경우 올바른 where 절을 생성한다", () => {
      const toneId = new ToneId();
      const criteria: CounselTechniquesCriteria.FindManyOptions = { toneId };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          toneId: toneId.getString(),
        },
      });
    });

    it("ids만 있는 경우 In 연산자를 사용한 where 절을 생성한다", () => {
      const ids = [new CounselTechniqueId(), new CounselTechniqueId()];
      const criteria: CounselTechniquesCriteria.FindManyOptions = { ids };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          id: In(ids.map((id) => id.getString())),
        },
      });
    });

    it("promptVersionId만 있는 경우 올바른 where 절을 생성한다", () => {
      const promptVersionId = new PromptVersionId();
      const criteria: CounselTechniquesCriteria.FindManyOptions = { promptVersionId };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("모든 조건이 있는 경우 모든 조건을 포함한 where 절을 생성한다", () => {
      const name = "test-technique";
      const toneId = new ToneId();
      const ids = [new CounselTechniqueId(), new CounselTechniqueId()];
      const promptVersionId = new PromptVersionId();

      const criteria: CounselTechniquesCriteria.FindManyOptions = {
        name,
        toneId,
        ids,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          name,
          toneId: toneId.getString(),
          id: In(ids.map((id) => id.getString())),
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 null인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const name = "test-technique";
      const toneId = null as any;
      const ids = undefined as any;
      const promptVersionId = new PromptVersionId();

      const criteria: CounselTechniquesCriteria.FindManyOptions = {
        name,
        toneId,
        ids,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          name,
          promptVersionId: promptVersionId.getString(),
        },
      });
    });

    it("일부 조건이 undefined인 경우 해당 조건은 where 절에 포함되지 않는다", () => {
      const name = undefined as any;
      const toneId = new ToneId();
      const ids = [new CounselTechniqueId()];
      const promptVersionId = undefined as any;

      const criteria: CounselTechniquesCriteria.FindManyOptions = {
        name,
        toneId,
        ids,
        promptVersionId,
      };

      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          toneId: toneId.getString(),
          id: In(ids.map((id) => id.getString())),
        },
      });
    });

    it("빈 ids 배열을 전달하면 In 연산자에 빈 배열이 전달된다", () => {
      const ids: CounselTechniqueId[] = [];
      const criteria: CounselTechniquesCriteria.FindManyOptions = { ids };
      const result = RepositoryCounselTechniqueCriteriaMapper.toFindManyOptions(criteria);

      expect(result).toEqual({
        where: {
          id: In([]),
        },
      });
    });
  });
});
