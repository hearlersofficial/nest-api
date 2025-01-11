import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";

import { fakerKO as faker } from "@faker-js/faker";
import { Dayjs } from "dayjs";

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
    if (validateResult.isFailure) {
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
});
