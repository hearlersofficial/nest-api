import { UserTrackings } from "~users/domains/users/models/user-trackings";
import { UserTrackingsInfo } from "~users/domains/users/models/user-trackings.info";

import { fakerKO as faker } from "@faker-js/faker";
import { getNowDayjs } from "~common/shared/utils/date";
import { UserId } from "~common/shared-kernel/identifiers/user.id";
import { UserTrackingId } from "~common/shared-kernel/identifiers/user-tracking.id";

describe("UserTrackingsInfo", () => {
  const createUserTracking = () => {
    const props = {
      userId: new UserId(),
      hasSeenIntroCutscene: faker.datatype.boolean(),
      createdAt: getNowDayjs(),
      updatedAt: getNowDayjs(),
      deletedAt: null,
    };
    return UserTrackings.create(props, new UserTrackingId()).value as UserTrackings;
  };

  describe("fromDomain", () => {
    it("UserTrackings 도메인 객체로부터 UserTrackingsInfo를 생성할 수 있다", () => {
      const userTracking = createUserTracking();
      const userTrackingInfo = UserTrackingsInfo.fromDomain(userTracking);

      expect(userTrackingInfo.id).toEqual(userTracking.id);
      expect(userTrackingInfo.userId).toEqual(userTracking.userId);
      expect(userTrackingInfo.hasSeenIntroCutscene).toBe(userTracking.hasSeenIntroCutscene);
      expect(userTrackingInfo.createdAt).toEqual(userTracking.createdAt);
      expect(userTrackingInfo.updatedAt).toEqual(userTracking.updatedAt);
      expect(userTrackingInfo.deletedAt).toEqual(userTracking.deletedAt);
    });
  });

  describe("fromDomainArray", () => {
    it("UserTrackings 도메인 객체 배열로부터 UserTrackingsInfo 배열을 생성할 수 있다", () => {
      const userTrackings = [createUserTracking(), createUserTracking()];
      const userTrackingInfos = UserTrackingsInfo.fromDomainArray(userTrackings);

      expect(userTrackingInfos).toHaveLength(2);
      expect(userTrackingInfos[0].id).toEqual(userTrackings[0].id);
      expect(userTrackingInfos[1].id).toEqual(userTrackings[1].id);
    });
  });
});
