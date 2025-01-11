import { Result } from "~shared/core/domain/Result";

import { fakerKO as faker } from "@faker-js/faker";

describe("Result", (): void => {
  it("실패시 value 에 접근하려 하면 에러가 나와야 한다", (): void => {
    expect(() => Result.fail("FAIL").value).toThrowError(Error);
  });

  it("실패시 넘긴 값은 같아야 한다.", (): void => {
    const errorValue: string = faker.lorem.words();

    expect(Result.fail(errorValue).errorValue).toEqual(errorValue);
  });

  it("성공시 넘긴 값의 value 는 넘긴 값이 나와야 한다", (): void => {
    const value: string = faker.lorem.words();

    expect(Result.ok(value).value).toEqual(value);
  });

  it("성공시 errorValue 는 undefined 이어야 한다", (): void => {
    expect(Result.ok("FAIL").errorValue).toBeUndefined();
  });

  it("getFailResultIfExist 는 실패한 경우에 첫번째 값을 반환하고, 모두 성공시에는 null 을 반환해야 한다.", (): void => {
    const successValue = "OK";
    const firstFailValue = faker.lorem.words();
    const secondFailValue = `${firstFailValue} ${faker.lorem.words()}`;

    expect(Result.getFailResultIfExist([Result.ok(successValue), Result.ok(successValue)])).toBeNull();
    expect(Result.getFailResultIfExist([Result.ok(successValue), Result.fail(firstFailValue), Result.fail(secondFailValue)])).toEqual(Result.fail(firstFailValue));
  });
});
