import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";

import { fakerKO as faker } from "@faker-js/faker";

describe("UniqueEntityID", (): void => {
  it("전달된 값이 반환", (): void => {
    const randomString: string = faker.lorem.word();
    const randomInt: number = faker.number.int({ min: 1, max: 100 });

    const uniqueEntityID: UniqueEntityId = new UniqueEntityId(randomString);
    const uniqueEntityID2: UniqueEntityId = new UniqueEntityId(randomInt);

    expect(uniqueEntityID.getValue()).toEqual(randomString);
    expect(uniqueEntityID2.getNumber()).toEqual(randomInt);
  });

  it("전달된 값이 없이 생성된 경우 0을 반환", (): void => {
    const uniqueEntityID: UniqueEntityId = new UniqueEntityId();

    expect(uniqueEntityID).toBeDefined();
    expect(uniqueEntityID.getValue()).toEqual(0);
  });
});
