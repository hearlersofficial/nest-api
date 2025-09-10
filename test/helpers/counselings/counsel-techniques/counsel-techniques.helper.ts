import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
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
import { CounselTechniquesEntity } from "~common/system/persistences/entities/prompts/counsel-techniques.entity";

export class CounselTechniquesHelper {
  static createCounselTechniquesProps(overrides: Partial<CounselTechniquesProps> = {}): CounselTechniquesProps {
    return {
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
      ...overrides,
    };
  }

  static createCounselTechniquesNewProps(
    overrides: Partial<CounselTechniquesNewProps> = {},
  ): CounselTechniquesNewProps {
    return {
      promptVersionId: new PromptVersionId(),
      name: faker.lorem.words(3),
      temperature: faker.number.float({ min: 0, max: 2, fractionDigits: 2 }),
      toneId: new ToneId(),
      context: faker.lorem.paragraph(),
      instruction: faker.lorem.sentence(),
      isStartTechnique: faker.datatype.boolean(),
      ...overrides,
    };
  }

  static createCounselTechniques(overrides: Partial<CounselTechniquesProps> = {}): CounselTechniques {
    const props = this.createCounselTechniquesProps(overrides);
    const id = new CounselTechniqueId();
    const result = CounselTechniques.create(props, id);
    return result.value as CounselTechniques;
  }

  static createCounselTechniquesNew(overrides: Partial<CounselTechniquesNewProps> = {}): CounselTechniques {
    const newProps = this.createCounselTechniquesNewProps(overrides);
    const result = CounselTechniques.createNew(newProps);
    return result.value as CounselTechniques;
  }

  static createCounselTechniqueInfo(overrides: Partial<CounselTechniquesProps> = {}): CounselTechniqueInfo {
    const counselTechnique = this.createCounselTechniques(overrides);
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  static createCounselTechniqueInfoArray(
    count: number,
    overrides: Partial<CounselTechniquesProps> = {},
  ): CounselTechniqueInfo[] {
    const counselTechniques = Array.from({ length: count }, () => this.createCounselTechniques(overrides));
    return CounselTechniqueInfo.fromDomainArray(counselTechniques);
  }

  static createCounselTechniquesArray(
    count: number,
    overrides: Partial<CounselTechniquesProps> = {},
  ): CounselTechniques[] {
    return Array.from({ length: count }, () => this.createCounselTechniques(overrides));
  }

  static createCounselTechniquesEntity(overrides: Partial<CounselTechniquesEntity> = {}): CounselTechniquesEntity {
    const entity = new CounselTechniquesEntity();
    entity.id = new CounselTechniqueId().getString();
    entity.promptVersionId = new PromptVersionId().getString();
    entity.name = faker.lorem.words(3);
    entity.temperature = faker.number.float({ min: 0, max: 2, fractionDigits: 2 });
    entity.toneId = new ToneId().getString();
    entity.context = faker.lorem.paragraph();
    entity.instruction = faker.lorem.sentence();
    entity.isStartTechnique = faker.datatype.boolean();
    entity.createdAt = new Date().toISOString();
    entity.updatedAt = new Date().toISOString();
    entity.deletedAt = null;

    Object.assign(entity, overrides);
    return entity;
  }

  static createCounselTechniquesEntityArray(
    count: number,
    overrides: Partial<CounselTechniquesEntity> = {},
  ): CounselTechniquesEntity[] {
    return Array.from({ length: count }, () => this.createCounselTechniquesEntity(overrides));
  }
}
