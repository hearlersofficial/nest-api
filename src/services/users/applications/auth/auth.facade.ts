import { AuthUsersService } from "~users/domains/auth-users/auth-users.service";
import { AuthUserInfo } from "~users/domains/auth-users/models/auth-user.info";
import { UsersInfo } from "~users/domains/users/models/users.info";
import { UsersService } from "~users/domains/users/users.service";

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";

@Injectable()
export class AuthFacade {
  constructor(
    private readonly usersService: UsersService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  async initializeUser(): Promise<{ user: UsersInfo; authUser: AuthUserInfo }> {
    const user = await this.usersService.create({});
    const authUser = await this.authUsersService.create({});

    await this.authUsersService.bindUser(new UniqueEntityId(authUser.id), user.id);

    return { user, authUser };
  }
}
