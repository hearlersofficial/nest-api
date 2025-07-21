import { UserManagementFacade } from "~users/applications/user-management/user-management.facade";
import { UsersModule } from "~users/domains/users/users.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [UsersModule],
  providers: [UserManagementFacade],
  exports: [UserManagementFacade],
})
export class UserManagementModule {}
