import { UsersInfo } from "~users/domains/users/models/users.info";
import { Users } from "~users/domains/users/models/users";

describe("UsersInfo", () => {
  const createUser = () => {
    return Users.createNew({}).value as Users;
  };

  describe("fromDomain", () => {
    it("Users 도메인 객체로부터 UsersInfo를 생성할 수 있다", () => {
      const user = createUser();
      const userInfo = UsersInfo.fromDomain(user);

      expect(userInfo.id).toBe(user.id.getString());
      expect(userInfo.nickname).toBe(user.nickname);
      expect(userInfo.userProfile.id).toBe(user.userProfile.id.getString());
      expect(userInfo.userMessageToken.id).toBe(user.userMessageToken.id.getString());
    });
  });

  describe("fromDomainArray", () => {
    it("Users 도메인 객체 배열로부터 UsersInfo 배열을 생성할 수 있다", () => {
      const users = [createUser(), createUser()];
      const userInfos = UsersInfo.fromDomainArray(users);

      expect(userInfos).toHaveLength(2);
      expect(userInfos[0].id).toBe(users[0].id.getString());
      expect(userInfos[1].id).toBe(users[1].id.getString());
    });
  });
});
