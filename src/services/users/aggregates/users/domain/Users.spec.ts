import { fakerKO as faker } from "@faker-js/faker";

import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { ProgressStatus, ProgressType } from "~/src/gen/com/hearlers/v1/model/user_pb";
import { EmotionalState } from "~shared/enums/EmotionalState.enum";
import { Users } from "~users/aggregates/users/domain/Users";
import { UserProgresses } from "~users/aggregates/users/domain/UserProgresses";
import { UserPrompts } from "~users/aggregates/users/domain/UserPrompts";

describe("Users", () => {
  describe("createNew", () => {
    it("새로운 Users를 생성할 수 있다", () => {
      const result = Users.createNew({});

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const user = result.value;
        expect(user.nickname).toBeDefined();
        expect(user.userProfile).toBeDefined();
        expect(user.userProgresses).toHaveLength(0);
        expect(user.userPrompts).toHaveLength(0);
        expect(user.isNew()).toBe(true);
      }
    });
  });

  describe("addProgress", () => {
    it("진행 상태를 추가할 수 있다", () => {
      const user = Users.createNew({}).value;

      const progressResult = UserProgresses.createNew({
        userId: user.id,
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.IN_PROGRESS,
      });

      expect(progressResult.isSuccess).toBe(true);
      if (progressResult.isSuccess) {
        const result = user.addProgress(progressResult.value);
        expect(result.isSuccess).toBe(true);
        expect(user.userProgresses).toHaveLength(1);
        expect(user.userProgresses[0].userId.equals(user.id)).toBe(true);
      }
    });
  });

  describe("addPrompt", () => {
    it("프롬프트를 추가할 수 있다", () => {
      const user = Users.createNew({}).value;

      const promptResult = UserPrompts.createNew({
        userId: user.id,
        templateId: new UniqueEntityId(1),
        context: {
          emotionalState: EmotionalState.ANGRY,
          recentEvents: [faker.lorem.sentence()],
        },
      });

      expect(promptResult.isSuccess).toBe(true);
      if (promptResult.isSuccess) {
        const result = user.addPrompt(promptResult.value);
        expect(result.isSuccess).toBe(true);
        expect(user.userPrompts).toHaveLength(1);
        expect(user.userPrompts[0].userId.equals(user.id)).toBe(true);
      }
    });
  });

  describe("delete/restore", () => {
    it("삭제하고 복구할 수 있다", () => {
      const user = Users.createNew({}).value;

      expect(user.deletedAt).toBeNull();

      user.delete();
      expect(user.deletedAt).not.toBeNull();

      user.restore();
      expect(user.deletedAt).toBeNull();
    });
  });
});
