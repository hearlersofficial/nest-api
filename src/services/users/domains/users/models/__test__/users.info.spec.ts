import { UsersInfo } from "~users/domains/users/models/user.info";
import { Users } from "~users/domains/users/models/users";

describe("UsersInfo", () => {
  const createUser = () => {
    return Users.createNew({}).value as Users;
  };

  describe("fromDomain", () => {
    it("Users 도메인 객체로부터 UsersInfo를 생성할 수 있다", () => {
      const user = createUser();
      const userInfo = UsersInfo.fromDomain(user);

      expect(userInfo.id).toEqual(user.id);
      expect(userInfo.nickname).toBe(user.nickname);
      expect(userInfo.userProfile.id).toEqual(user.userProfile.id);
      expect(userInfo.userMessageToken.id).toEqual(user.userMessageToken.id);
    });
  });

  describe("fromDomainArray", () => {
    it("Users 도메인 객체 배열로부터 UsersInfo 배열을 생성할 수 있다", () => {
      const users = [createUser(), createUser()];
      const userInfos = UsersInfo.fromDomainArray(users);

      expect(userInfos).toHaveLength(2);
      expect(userInfos[0].id).toEqual(users[0].id);
      expect(userInfos[1].id).toEqual(users[1].id);
    });
  });
});
