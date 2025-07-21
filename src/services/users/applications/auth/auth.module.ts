import { AuthFacade } from "~users/applications/auth/auth.facade";
import { AuthUsersModule } from "~users/domains/auth-users/auth-users.module";
import { UsersModule } from "~users/domains/users/users.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule, AuthUsersModule],
  providers: [AuthFacade],
  exports: [AuthFacade],
})
export class AuthModule {}
