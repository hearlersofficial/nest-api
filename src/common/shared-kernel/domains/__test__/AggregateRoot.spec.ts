import { Message } from "@bufbuild/protobuf";
import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/Date.utils";
import { AggregateRoot } from "~common/shared-kernel/domains/AggregateRoot";
import { DomainEvent } from "~common/shared-kernel/domains/DomainEvent";
import { Result } from "~common/shared-kernel/domains/Result";
import { UniqueEntityId } from "~common/shared-kernel/domains/UniqueEntityId";
import { Dayjs } from "dayjs";

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

interface TestAggregateNewProps {
  name: string;
}

interface TestAggregateProps extends TestAggregateNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}
class TestAggregate extends AggregateRoot<TestAggregateProps> {
  private constructor(props: TestAggregateProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: TestAggregateProps, id: UniqueEntityId): Result<TestAggregate> {
    const testAggregate = new TestAggregate(props, id);
    const validateResult = testAggregate.validateDomain();
    if (validateResult.isFailureResult()) {
      return Result.fail<TestAggregate>(validateResult.error);
    }
    return Result.ok<TestAggregate>(testAggregate);
  }
  public static createNew(newProps: TestAggregateNewProps): Result<TestAggregate> {
    const now = getNowDayjs();
    return this.create(
      {
        name: newProps.name,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      new UniqueEntityId(),
    );
  }

  protected validateDomain(): Result<void> {
    if (!this.props.name) {
      return Result.fail("이름은 필수입니다");
    }
    return Result.ok();
  }

  get name(): string {
    return this.props.name;
  }

  public addTestEvent(): void {
    this.addDomainEvent(new TestCreatedEvent(new TestCreatedPayload(this.name)));
  }
}

describe("AggregateRoot", () => {
  it("Aggregate를 생성할 수 있다", () => {
    const name = faker.person.firstName();
    const result = TestAggregate.createNew({ name });

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeDefined();
    if (result.isSuccess && result.value) {
      expect(result.value.name).toBe(name);
      expect(result.value.id.getNumber()).toBe(0);
    }
  });

  describe("도메인 이벤트", () => {
    it("도메인 이벤트를 추가하고 조회할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestAggregate.createNew({ name }).value;

      entity.addTestEvent();

      expect(entity.domainEvents).toHaveLength(1);
      expect(entity.domainEvents[0]).toBeInstanceOf(TestCreatedEvent);
      expect((entity.domainEvents[0] as TestCreatedEvent).payload.name).toBe(name);
    });

    it("이벤트를 초기화할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestAggregate.createNew({ name }).value;

      entity.addTestEvent();
      expect(entity.domainEvents).toHaveLength(1);

      entity.clearEvents();
      expect(entity.domainEvents).toHaveLength(0);
    });

    it("여러 이벤트를 순서대로 추가할 수 있다", () => {
      const name = faker.person.firstName();
      const entity = TestAggregate.createNew({ name }).value;

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
