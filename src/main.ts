import { AppModule } from "~/src/app.module";
import { CounselsServiceModule } from "~/src/services/counselings/counsels.service.module";
import { UsersServiceModule } from "~/src/services/users/users.service.module";

import * as dotenv from "dotenv";
dotenv.config({ path: [".env", ".env.dev"] });

import { createMicroservices, serviceConfigs, ServiceType } from "~/src/shared/core/presentations/Config";

const moduleMap = {
  [ServiceType.APP]: AppModule,
  [ServiceType.USERS]: UsersServiceModule,
  [ServiceType.COUNSELINGS]: CounselsServiceModule,
};

async function bootstrap(): Promise<void> {
  const serviceType = process.env.SERVICE_TYPE as ServiceType;

  if (!serviceType || !(serviceType in ServiceType)) {
    throw new Error(`Invalid SERVICE_TYPE. Must be one of: ${Object.values(ServiceType).join(", ")}`);
  }

  const config = serviceConfigs[serviceType];
  const module = moduleMap[serviceType];

  const app = await createMicroservices(module, serviceType, config);
  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
