import { Identifier } from "~shared/core/domain/Identifier";

import { fakerKO as faker } from "@faker-js/faker";

describe("Identifier", (): void => {
  describe("equals", (): void => {
    it("equals() 의 parameter 로 전달된 값이 Identifier 가 아닌 경우 false 를 반환", (): void => {
      const identifierValue: string = faker.lorem.word();

      const identifier: Identifier<string> = new Identifier(identifierValue);
      expect(identifier.equals(identifierValue as unknown as Identifier<string>)).toBeFalsy();
    });

    it("value 로 넘긴 값이 같을 경우 equals() 는 true 를 반환", (): void => {
      const identifierValue: string = faker.lorem.word();

      const identifier: Identifier<string> = new Identifier(identifierValue);
      const identifier2: Identifier<string> = new Identifier(identifierValue);

      expect(identifier.equals(identifier2)).toBeTruthy();
    });

    it("value 로 넘긴 값이 다를 경우 equals() 는 false 를 반환", (): void => {
      const identifierValue: string = faker.lorem.word();
      const anotherIdentifierValue: string = `${identifierValue}_another`;

      const identifier: Identifier<string> = new Identifier(identifierValue);
      const identifier2: Identifier<string> = new Identifier(anotherIdentifierValue);

      expect(identifier.equals(identifier2)).toBeFalsy();
    });

    it("value 로 넘긴 값의 타입이 다를 경우 equals() 는 false 를 반환", (): void => {
      const numberValue: number = faker.number.int({ min: 1, max: 100 });
      const stringValue: string = numberValue.toString();

      const identifier: Identifier<number> = new Identifier(numberValue);
      const identifier2: Identifier<string> = new Identifier(stringValue);

      expect(identifier.equals(identifier2 as unknown as Identifier<number>)).toBeFalsy();
    });
  });

  describe("getValue", (): void => {
    it("value 를 반환", (): void => {
      const TEST_VALUE1: string = faker.lorem.word();
      const TEST_VALUE2: number = faker.number.int({ min: 1, max: 100 });

      const identifier: Identifier<string> = new Identifier(TEST_VALUE1);
      const identifier2: Identifier<number> = new Identifier(TEST_VALUE2);

      expect(identifier.getValue()).toEqual(TEST_VALUE1);
      expect(identifier2.getNumber()).toEqual(TEST_VALUE2);
    });
  });

  describe("isNewIdentifier", (): void => {
    it("0으로 생성시 isNewIdentifier() 는 true 를 반환", (): void => {
      const identifier: Identifier<number> = new Identifier(0);

      expect(identifier.isNewIdentifier()).toEqual(true);
    });
  });
});
