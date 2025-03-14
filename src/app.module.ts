import { UsersServiceModule } from "~users/users-service.module";
import { CounselsServiceModule } from "~counselings/counsels.service.module";

import { Logger, Module, OnModuleInit } from "@nestjs/common";

@Module({
  imports: [UsersServiceModule, CounselsServiceModule],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    this.logger.log("App Module has been initialized");
    this.logger.log(`Environment: ${process.env.NODE_ENV}`);
    this.logger.log(`GRPC Port: ${process.env.GRPC_PORT}`);
  }
}
