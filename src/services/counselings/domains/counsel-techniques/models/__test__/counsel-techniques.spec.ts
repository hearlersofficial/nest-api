import {
  CounselTechniques,
  CounselTechniquesNewProps,
  CounselTechniquesProps,
} from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";

describe("CounselTechniques", () => {
  const createValidProps = (): CounselTechniquesProps => ({
    promptVersionId: new PromptVersionId(),
    name: faker.lorem.words(3),
    temperature: faker.number.float({ min: 0, max: 2, fractionDigits: 2 }),
    toneId: new ToneId(),
    context: faker.lorem.paragraph(),
    instruction: faker.lorem.sentence(),
    isStartTechnique: faker.datatype.boolean(),
    createdAt: getNowDayjs(),
    updatedAt: getNowDayjs(),
    deletedAt: null,
  });

  const createValidNewProps = (): CounselTechniquesNewProps => ({
    promptVersionId: new PromptVersionId(),
    name: faker.lorem.words(3),
    temperature: faker.number.float({ min: 0, max: 2, fractionDigits: 2 }),
    toneId: new ToneId(),
    context: faker.lorem.paragraph(),
    instruction: faker.lorem.sentence(),
    isStartTechnique: faker.datatype.boolean(),
  });

  describe("create", () => {
    it("유효한 props로 CounselTechniques를 생성할 수 있다", () => {
      const props = createValidProps();
      const id = new CounselTechniqueId();
      const result = CounselTechniques.create(props, id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(CounselTechniques);
      expect(result.value.id).toEqual(id);
    });

    it("유효하지 않은 props로 생성하면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        name: undefined as any, // undefined 이름
      };
      const id = new CounselTechniqueId();
      const result = CounselTechniques.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("이름은 필수입니다");
    });

    it("빈 context로 생성하면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        context: undefined as any, // undefined 컨텍스트
      };
      const id = new CounselTechniqueId();
      const result = CounselTechniques.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("컨텍스트는 필수입니다");
    });

    it("빈 instruction으로 생성하면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        instruction: undefined as any, // undefined 지시사항
      };
      const id = new CounselTechniqueId();
      const result = CounselTechniques.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("지시사항은 필수입니다");
    });

    it("toneId가 없으면 실패한다", () => {
      const invalidProps = {
        ...createValidProps(),
        toneId: null as any, // null toneId
      };
      const id = new CounselTechniqueId();
      const result = CounselTechniques.create(invalidProps, id);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("톤 ID는 필수입니다");
    });
  });

  describe("createNew", () => {
    it("유효한 newProps로 CounselTechniques를 생성할 수 있다", () => {
      const newProps = createValidNewProps();
      const result = CounselTechniques.createNew(newProps);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeInstanceOf(CounselTechniques);
      expect(result.value.id).toBeInstanceOf(CounselTechniqueId);
      expect(result.value.createdAt).toBeDefined();
      expect(result.value.updatedAt).toBeDefined();
      expect(result.value.deletedAt).toBeNull();
    });

    it("유효하지 않은 newProps로 생성하면 실패한다", () => {
      const invalidNewProps = {
        ...createValidNewProps(),
        name: undefined as any, // undefined 이름
      };
      const result = CounselTechniques.createNew(invalidNewProps);

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("이름은 필수입니다");
    });
  });

  describe("update", () => {
    let counselTechnique: CounselTechniques;

    beforeEach(() => {
      const props = createValidProps();
      const id = new CounselTechniqueId();
      counselTechnique = CounselTechniques.create(props, id).value as CounselTechniques;
    });

    it("유효한 업데이트를 수행할 수 있다", () => {
      const newName = faker.lorem.words(2);
      const newContext = faker.lorem.paragraph();
      const newInstruction = faker.lorem.sentence();
      const newToneId = new ToneId();
      const newIsStartTechnique = !counselTechnique.isStartTechnique;

      const result = counselTechnique.update({
        name: newName,
        context: newContext,
        instruction: newInstruction,
        toneId: newToneId,
        isStartTechnique: newIsStartTechnique,
      });

      expect(result.isSuccess).toBe(true);
      expect(counselTechnique.name).toBe(newName);
      expect(counselTechnique.context).toBe(newContext);
      expect(counselTechnique.instruction).toBe(newInstruction);
      expect(counselTechnique.toneId).toEqual(newToneId);
      expect(counselTechnique.isStartTechnique).toBe(newIsStartTechnique);
      expect(counselTechnique.updatedAt).toBeDefined();
    });

    it("같은 값으로 업데이트하면 변경되지 않는다", () => {
      const originalName = counselTechnique.name;
      const originalUpdatedAt = counselTechnique.updatedAt;

      const result = counselTechnique.update({
        name: originalName,
      });

      expect(result.isSuccess).toBe(true);
      expect(counselTechnique.name).toBe(originalName);
      expect(counselTechnique.updatedAt).toEqual(originalUpdatedAt);
    });

    it("일부 속성만 업데이트할 수 있다", () => {
      const newName = faker.lorem.words(2);
      const originalContext = counselTechnique.context;

      const result = counselTechnique.update({
        name: newName,
      });

      expect(result.isSuccess).toBe(true);
      expect(counselTechnique.name).toBe(newName);
      expect(counselTechnique.context).toBe(originalContext);
    });
  });

  describe("delete", () => {
    let counselTechnique: CounselTechniques;

    beforeEach(() => {
      const props = createValidProps();
      const id = new CounselTechniqueId();
      counselTechnique = CounselTechniques.create(props, id).value as CounselTechniques;
    });

    it("삭제할 수 있다", () => {
      expect(counselTechnique.deletedAt).toBeNull();

      counselTechnique.delete();

      expect(counselTechnique.deletedAt).toBeDefined();
      expect(counselTechnique.updatedAt).toBeDefined();
    });
  });

  describe("restore", () => {
    let counselTechnique: CounselTechniques;

    beforeEach(() => {
      const props = createValidProps();
      const id = new CounselTechniqueId();
      counselTechnique = CounselTechniques.create(props, id).value as CounselTechniques;
      counselTechnique.delete();
    });

    it("복원할 수 있다", () => {
      expect(counselTechnique.deletedAt).toBeDefined();

      counselTechnique.restore();

      expect(counselTechnique.deletedAt).toBeNull();
    });
  });

  describe("getters", () => {
    let counselTechnique: CounselTechniques;
    let props: CounselTechniquesProps;

    beforeEach(() => {
      props = createValidProps();
      const id = new CounselTechniqueId();
      counselTechnique = CounselTechniques.create(props, id).value as CounselTechniques;
    });

    it("모든 getter가 올바른 값을 반환한다", () => {
      expect(counselTechnique.promptVersionId).toEqual(props.promptVersionId);
      expect(counselTechnique.name).toBe(props.name);
      expect(counselTechnique.temperature).toBe(props.temperature);
      expect(counselTechnique.toneId).toEqual(props.toneId);
      expect(counselTechnique.context).toBe(props.context);
      expect(counselTechnique.instruction).toBe(props.instruction);
      expect(counselTechnique.isStartTechnique).toBe(props.isStartTechnique);
      expect(counselTechnique.createdAt).toEqual(props.createdAt);
      expect(counselTechnique.updatedAt).toEqual(props.updatedAt);
      expect(counselTechnique.deletedAt).toBeNull();
    });
  });
});
