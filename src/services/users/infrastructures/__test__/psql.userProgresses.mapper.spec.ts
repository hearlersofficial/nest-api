import { UserProgressesEntity } from "~shared/core/infrastructure/entities/users/UserProgresses.entity";
import { UserProgresses } from "~users/domains/users/models/UserProgresses";
import { PsqlUserProgressesMapper } from "~users/infrastructures/mappers/psql.userProgresses.mapper";
import { ProgressStatus, ProgressType } from "~proto/com/hearlers/v1/model/user_pb";

import { fakerKO as faker } from "@faker-js/faker";
import { InternalServerErrorException } from "@nestjs/common";
import { formatDayjs, getNowDayjs } from "~common/shared/utils/Date.utils";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";

describe("PsqlUserProgressesMapper", () => {
  const createMockUserProgressesEntity = () => {
    const entity = new UserProgressesEntity();
    entity.id = faker.number.int();
    entity.progressType = ProgressType.ONBOARDING;
    entity.status = ProgressStatus.IN_PROGRESS;
    entity.lastUpdated = formatDayjs(getNowDayjs());
    entity.createdAt = formatDayjs(getNowDayjs());
    entity.updatedAt = formatDayjs(getNowDayjs());
    entity.deletedAt = null;

    return entity;
  };

  describe("toDomain", () => {
    it("Entity를 Domain으로 변환할 수 있다", () => {
      const entity = createMockUserProgressesEntity();
      const domain = PsqlUserProgressesMapper.toDomain(entity);

      expect(domain).toBeDefined();
      expect(domain?.id.equals(new UniqueEntityId(entity.id))).toBe(true);
      expect(domain?.userId.equals(new UniqueEntityId(entity.userId))).toBe(true);
      expect(domain?.progressType).toBe(entity.progressType);
      expect(domain?.status).toBe(entity.status);
      expect(formatDayjs(domain?.lastUpdated)).toBe(entity.lastUpdated);
    });

    it("null Entity를 변환하면 null을 반환한다", () => {
      const domain = PsqlUserProgressesMapper.toDomain(null as any);
      expect(domain).toBeNull();
    });

    it("유효하지 않은 상태로 변환을 시도하면 에러를 던진다", () => {
      const entity = createMockUserProgressesEntity();
      entity.status = "INVALID" as unknown as ProgressStatus;

      expect(() => PsqlUserProgressesMapper.toDomain(entity)).toThrow(InternalServerErrorException);
    });
  });

  describe("toEntity", () => {
    it("Domain을 Entity로 변환할 수 있다", () => {
      const userProgresses = UserProgresses.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      }).value;

      // 상태 업데이트
      userProgresses.updateStatus(ProgressStatus.IN_PROGRESS);

      const entity = PsqlUserProgressesMapper.toEntity(userProgresses);

      expect(entity).toBeDefined();
      expect(entity.progressType).toBe(userProgresses.progressType);
      expect(entity.status).toBe(userProgresses.status);
      expect(entity.lastUpdated).toBe(formatDayjs(userProgresses.lastUpdated));
    });

    it("초기 상태의 Domain을 변환할 수 있다", () => {
      const userProgresses = UserProgresses.createNew({
        userId: new UniqueEntityId(faker.number.int()),
        progressType: ProgressType.ONBOARDING,
        status: ProgressStatus.NOT_STARTED,
      }).value;

      const entity = PsqlUserProgressesMapper.toEntity(userProgresses);

      expect(entity).toBeDefined();
      expect(entity.status).toBe(ProgressStatus.NOT_STARTED);
      expect(entity.lastUpdated).toBe(formatDayjs(userProgresses.lastUpdated));
    });
  });
});
