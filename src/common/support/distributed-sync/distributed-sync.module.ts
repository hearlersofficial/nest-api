import { Module } from "@nestjs/common";
import { CacheManager } from "~common/support/distributed-sync/cache/cache.manager";
import { InMemoryCacheManager } from "~common/support/distributed-sync/cache/infrastructures/in-memory-cache-manager";
import { CacheBasedLockManager } from "~common/support/distributed-sync/lock/infrastructures/cache-based-lock-manager";
import { LockManager } from "~common/support/distributed-sync/lock/lock.manager";

@Module({
  providers: [
    {
      provide: CacheManager,
      useClass: InMemoryCacheManager,
    },
    {
      provide: LockManager,
      useClass: CacheBasedLockManager,
    },
  ],
  exports: [CacheManager, LockManager],
})
export class DistributedSyncModule {}
