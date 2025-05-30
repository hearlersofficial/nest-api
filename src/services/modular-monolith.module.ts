import { UsersServiceModule } from "~users/users-service.module";
import { CounselsServiceModule } from "~counselings/counsels.service.module";

import { Module } from "@nestjs/common";

@Module({
  imports: [CounselsServiceModule, UsersServiceModule],
})
export class ModularMonolithModule {}
