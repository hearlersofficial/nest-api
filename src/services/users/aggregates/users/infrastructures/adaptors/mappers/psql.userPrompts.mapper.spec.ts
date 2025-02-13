import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { UserPromptsEntity } from "~shared/core/infrastructure/entities/UserPrompts.entity";
import { EmotionalState } from "~shared/enums/EmotionalState.enum";
import { EntityConversation } from "~shared/types/prompts.types";
import { formatDayjs, getNowDayjs } from "~shared/utils/Date.utils";
import { UserPrompts } from "~users/aggregates/users/domain/UserPrompts";
import { PsqlUserPromptsMapper } from "~users/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper";

<<<<<<< HEAD:src/services/users/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper.spec.ts
import { faker } from "@faker-js/faker";
=======
import { UserPromptsEntity } from "~/src/shared/core/infrastructure/entities/users/UserPrompts.entity";
import { PsqlUserPromptsMapper } from "~/src/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper";
import { UserPrompts } from "~/src/aggregates/users/domain/UserPrompts";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { EmotionalState } from "~/src/shared/enums/EmotionalState.enum";
import { EntityConversation } from "~/src/shared/types/prompts.types";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/users/infrastructures/adaptors/mappers/psql.userPrompts.mapper.spec.ts

describe("PsqlUserPromptsMapper", () => {
  const createMockUserPromptsEntity = () => {
    const entity = new UserPromptsEntity();
    entity.id = faker.number.int();
    entity.userId = faker.number.int();
    entity.templateId = faker.number.int();
    entity.context = {
      emotionalState: EmotionalState.ANGRY,
      recentEvents: [faker.lorem.sentence()],
    };
    entity.generatedPrompt = faker.lorem.paragraph();

    const conversation: EntityConversation = {
      role: "user",
      content: faker.lorem.sentence(),
      timestamp: formatDayjs(getNowDayjs()),
    };
    entity.conversationHistory = [conversation];

    entity.analysis = {
      sentimentScore: 0.8,
      keyTopics: [faker.lorem.word()],
    };
    entity.createdAt = formatDayjs(getNowDayjs());
    entity.updatedAt = formatDayjs(getNowDayjs());
    entity.deletedAt = null;

    return entity;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserPromptsEntity();
      const domain = PsqlUserPromptsMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.userId.equals(new UniqueEntityId(entity.userId))).toBe(true);
      expect(domain?.templateId.equals(new UniqueEntityId(entity.templateId))).toBe(true);
      expect(domain?.context).toEqual(entity.context);
      expect(domain?.generatedPrompt).toBe(entity.generatedPrompt);
      expect(domain?.conversationHistory).toHaveLength(entity.conversationHistory.length);
      expect(domain?.analysis).toEqual(entity.analysis);
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      const domain = PsqlUserPromptsMapper.toDomain(null as any);
      expect(domain).toBeNull();
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      const userPrompts = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: {
          emotionalState: EmotionalState.ANGRY,
          recentEvents: [faker.lorem.sentence()],
        },
      }).value as UserPrompts;

      // 프롬프트 추가
      userPrompts.setGeneratedPrompt(faker.lorem.paragraph());

      // 대화 추가
      userPrompts.addConversation("user", faker.lorem.sentence());

      // 분석 추가
      userPrompts.updateAnalysis({
        sentimentScore: 0.8,
        keyTopics: [faker.lorem.word()],
      });

      const entity = PsqlUserPromptsMapper.toEntity(userPrompts);

      expect(entity).toBeDefined();
      expect(entity.context).toEqual(userPrompts.context);
      expect(entity.generatedPrompt).toBe(userPrompts.generatedPrompt);
      expect(entity.conversationHistory).toHaveLength(userPrompts.conversationHistory.length);
      expect(entity.analysis).toEqual(userPrompts.analysis);
    });
  });
});
