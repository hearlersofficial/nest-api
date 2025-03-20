import { AppModule } from "~/src/app.module";
import { createMicroservices, serviceConfigs, ServiceType } from "~shared/core/presentations/Config";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import * as dotenv from "dotenv";
import { initializeTransactionalContext } from "typeorm-transactional";
dotenv.config({ path: [".env", ".env.dev"] });

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();

  dayjs.extend(utc);
  dayjs.extend(isBetween);

  const serviceType = process.env.SERVICE_TYPE as ServiceType;

  if (!serviceType || !(serviceType in ServiceType)) {
    throw new Error(`Invalid SERVICE_TYPE. Must be one of: ${Object.values(ServiceType).join(", ")}`);
  }

  const config = serviceConfigs[serviceType];
  const app = await createMicroservices(AppModule.register(), serviceType, config);

  await app.init();
  await app.startAllMicroservices();
}

bootstrap();
