import { DomainEntity } from "~shared/core/domain/DomainEntity";
import { DomainEvent } from "~shared/core/domain/events/DomainEvent";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { Message } from "@bufbuild/protobuf";
import { fakerKO as faker } from "@faker-js/faker";
import { Dayjs } from "dayjs";

interface TestEntityNewProps {
  name: string;
  value: number;
}

// 테스트를 위한 인터페이스 정의
interface TestEntityProps extends TestEntityNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

// 테스트용 도메인 이벤트 추가
class TestCreatedPayload implements Message {
  constructor(name: string) {
    this.name = name;
  }
  name: string;
  $typeName: string = "TestCreatedPayload";
}

class TestCreatedEvent implements DomainEvent {
  constructor(payload: TestCreatedPayload) {
    this.topic = "test.created";
    this.payload = payload;
    this.binary = new Uint8Array(10);
  }
  topic: string;
  payload: TestCreatedPayload;
  binary: Uint8Array;
}

// 테스트용 구현체
class TestEntity extends DomainEntity<TestEntityProps> {
  private constructor(props: TestEntityProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: TestEntityProps, id: UniqueEntityId): Result<TestEntity> {
    const testEntity = new TestEntity(props, id);
    const validateResult = testEntity.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<TestEntity>(validateResult.error);
    }
    return Result.ok<TestEntity>(testEntity);
  }

  public static createNew(newProps: TestEntityNewProps): Result<TestEntity> {
    const now = getNowDayjs();
    return this.create({ ...newProps, createdAt: now, updatedAt: now, deletedAt: null }, new UniqueEntityId());
  }

  protected validateDomain(): Result<void> {
    if (!this.props.name) {
      return Result.fail("이름은 필수입니다");
    }
    if (this.props.value <= 0) {
      return Result.fail("값은 0보다 커야 합니다");
    }
    return Result.ok();
  }

  // Getters for testing
  get name(): string {
    return this.props.name;
  }

  get value(): number {
    return this.props.value;
  }

  public addTestEvent(): void {
    this.addDomainEvent(new TestCreatedEvent(new TestCreatedPayload(this.name)));
  }
}

describe("DomainEntity", () => {
  describe("createNew", () => {
    it("새로운 엔티티를 생성할 수 있다", () => {
      const name = faker.person.firstName();
      const result = TestEntity.createNew({ name, value: faker.number.int({ min: 1, max: 100 }) });

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      if (result.isSuccess && result.value) {
        expect(result.value.name).toBe(name);
        expect(result.value.value).toBeGreaterThan(0);
        expect(result.value.id.getNumber()).toBe(0);
      }
    });

    it("유효하지 않은 데이터로 생성 시 실패한다", () => {
      const result = TestEntity.createNew({ name: "", value: 0 });

      expect(result.isSuccess).toBe(false);
      expect(result.error).toBe("이름은 필수입니다");
    });
  });

  describe("create", () => {
    it("기존 데이터로 엔티티를 생성할 수 있다", () => {
      const props = {
        name: faker.person.firstName(),
        value: faker.number.int({ min: 1, max: 100 }),
        createdAt: getNowDayjs(),
        updatedAt: getNowDayjs(),
        deletedAt: null,
      };
      const id = new UniqueEntityId(faker.number.int({ min: 1, max: 100 }));

      const result = TestEntity.create(props, id);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeDefined();
      if (result.isSuccess && result.value) {
        expect(result.value.name).toBe(props.name);
        expect(result.value.value).toBe(props.value);
        expect(result.value.id.equals(id)).toBe(true);
      }
    });
  });

  describe("equals", () => {
    it("같은 ID를 가진 엔티티는 동일하다고 판단한다", () => {
      const id = new UniqueEntityId(1);
      const props = {
        name: faker.person.firstName(),
        value: faker.number.int({ min: 1, max: 100 }),
        createdAt: getNowDayjs(),
        updatedAt: getNowDayjs(),
        deletedAt: null,
      };

      const entity1 = TestEntity.create(props, id).value as TestEntity;
      const entity2 = TestEntity.create(props, id).value as TestEntity;
      expect(entity1.id.equals(entity2.id)).toBe(true);
      expect(entity1.equals(entity2)).toBe(true);
    });

    it("다른 ID를 가진 엔티티는 다르다고 판단한다", () => {
      const props = {
        name: faker.person.firstName(),
        value: faker.number.int({ min: 1, max: 100 }),
        createdAt: getNowDayjs(),
        updatedAt: getNowDayjs(),
        deletedAt: null,
      };

      const entity1 = TestEntity.create(props, new UniqueEntityId(1)).value as TestEntity;
      const entity2 = TestEntity.create(props, new UniqueEntityId(2)).value as TestEntity;

      expect(entity1.equals(entity2)).toBe(false);
    });
  });

  describe("도메인 이벤트", () => {
    it("도메인 이벤트를 추가하고 조회할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestEntity.createNew({ name, value: faker.number.int({ min: 1, max: 100 }) }).value as TestEntity;

      entity.addTestEvent();

      expect(entity.domainEvents).toHaveLength(1);
      expect(entity.domainEvents[0]).toBeInstanceOf(TestCreatedEvent);
      expect((entity.domainEvents[0] as TestCreatedEvent).payload.name).toBe(name);
    });

    it("이벤트를 초기화할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestEntity.createNew({ name, value: faker.number.int({ min: 1, max: 100 }) }).value as TestEntity;

      entity.addTestEvent();
      expect(entity.domainEvents).toHaveLength(1);

      entity.clearEvents();
      expect(entity.domainEvents).toHaveLength(0);
    });

    it("여러 이벤트를 순서대로 추가할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestEntity.createNew({ name, value: faker.number.int({ min: 1, max: 100 }) }).value as TestEntity;

      entity.addTestEvent();
      entity.addTestEvent();
      entity.addTestEvent();

      expect(entity.domainEvents).toHaveLength(3);
      entity.domainEvents.forEach((event) => {
        expect(event).toBeInstanceOf(TestCreatedEvent);
        expect((event as TestCreatedEvent).payload.name).toBe(name);
      });
    });
  });
});
