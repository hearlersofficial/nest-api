import { Snowflake } from "@sapphire/snowflake";
import { Identifier } from "~common/shared-kernel/domains/Identifier";

export class UniqueEntityId extends Identifier<string | number> {
  private static readonly EPOCH = 1609459200000; // 2021-01-01 기준
  private static readonly snowflake = new Snowflake(UniqueEntityId.EPOCH);

  constructor(id?: string | number) {
    if (!id) {
      const envWorkerId = process.env.WORKER_ID;
      // 없을 경우 없이 생성
      const workerId = envWorkerId ? BigInt(envWorkerId) : undefined;
      // Snowflake ID 생성
      const generatedId = UniqueEntityId.snowflake
        .generate({
          workerId: workerId,
        })
        .toString();
      super(generatedId);
    } else {
      super(id);
    }
  }
}
