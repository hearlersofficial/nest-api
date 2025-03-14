import { AppModule } from "~/src/app.module";
import { createMicroservices, serviceConfigs, ServiceType } from "~shared/core/presentations/Config";
import { UsersServiceModule } from "~users/users-service.module";
import { CounselsServiceModule } from "~counselings/counsels.service.module";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import * as dotenv from "dotenv";
dotenv.config({ path: [".env", ".env.dev"] });

const moduleMap = {
  [ServiceType.APP]: AppModule,
  [ServiceType.USERS]: UsersServiceModule,
  [ServiceType.COUNSELINGS]: CounselsServiceModule,
};

async function bootstrap(): Promise<void> {
  dayjs.extend(utc);
  dayjs.extend(isBetween);

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
