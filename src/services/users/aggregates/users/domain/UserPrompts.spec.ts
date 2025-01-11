import { fakerKO as faker } from "@faker-js/faker";
import { UserPrompts } from "./UserPrompts";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { EmotionalState } from "~/src/shared/enums/EmotionalState.enum";
import { Context, Analysis } from "~/src/shared/types/prompts.types";

describe("UserPrompts", () => {
  const createValidContext = (): Context => ({
    emotionalState: EmotionalState.ANGRY,
    recentEvents: [faker.lorem.sentence()],
    triggers: [faker.lorem.word()],
    preferences: { key: faker.lorem.word() },
  });

  describe("createNew", () => {
    it("새로운 UserPrompt를 생성할 수 있다", () => {
      const userId = new UniqueEntityId(faker.number.int());
      const templateId = new UniqueEntityId(faker.number.int());
      const context = createValidContext();

      const result = UserPrompts.createNew({
        userId,
        templateId,
        context,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const prompt = result.value;
        expect(prompt.userId.equals(userId)).toBe(true);
        expect(prompt.templateId.equals(templateId)).toBe(true);
        expect(prompt.context).toEqual(context);
        expect(prompt.conversationHistory).toEqual([]);
        expect(prompt.generatedPrompt).toBe("");
        expect(prompt.analysis).toBeUndefined();
      }
    });

    it("필수 값이 없으면 생성에 실패한다", () => {
      const result = UserPrompts.createNew({
        userId: undefined as any,
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserPrompts] 사용자 ID는 필수입니다");
    });

    it("유효하지 않은 감정 상태로 생성하면 실패한다", () => {
      const result = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: {
          emotionalState: "INVALID" as EmotionalState,
          recentEvents: [],
        },
      });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserPrompts] 유효하지 않은 감정 상태입니다");
    });
  });

  describe("setGeneratedPrompt", () => {
    it("프롬프트를 설정할 수 있다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      const generatedPrompt = faker.lorem.paragraph();
      const result = prompt.setGeneratedPrompt(generatedPrompt);

      expect(result.isSuccess).toBe(true);
      expect(prompt.generatedPrompt).toBe(generatedPrompt);
    });

    it("빈 프롬프트로 설정하면 실패한다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      const result = prompt.setGeneratedPrompt("");

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserPrompts] 프롬프트는 비어있을 수 없습니다");
    });
  });

  describe("addConversation", () => {
    it("대화를 추가할 수 있다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      const content = faker.lorem.sentence();
      const result = prompt.addConversation("user", content);

      expect(result.isSuccess).toBe(true);
      expect(prompt.conversationHistory).toHaveLength(1);
      expect(prompt.conversationHistory[0].role).toBe("user");
      expect(prompt.conversationHistory[0].content).toBe(content);
    });

    it("빈 내용으로 대화를 추가하면 실패한다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      const result = prompt.addConversation("user", "");

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain("[UserPrompts] 대화 내용은 비어있을 수 없습니다");
      expect(prompt.conversationHistory).toHaveLength(0);
    });
  });

  describe("updateAnalysis", () => {
    it("분석 데이터를 업데이트할 수 있다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      const analysis: Analysis = {
        sentimentScore: 0.8,
        keyTopics: [faker.lorem.word()],
        recommendations: [faker.lorem.sentence()],
        riskFactors: [],
      };

      const result = prompt.updateAnalysis(analysis);

      expect(result.isSuccess).toBe(true);
      expect(prompt.analysis).toEqual(analysis);
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const prompt = UserPrompts.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        templateId: new UniqueEntityId(faker.number.int()),
        context: createValidContext(),
      }).value as UserPrompts;

      expect(prompt.deletedAt).toBeNull();

      prompt.delete();
      expect(prompt.deletedAt).not.toBeNull();

      prompt.restore();
      expect(prompt.deletedAt).toBeNull();
    });
  });
});
