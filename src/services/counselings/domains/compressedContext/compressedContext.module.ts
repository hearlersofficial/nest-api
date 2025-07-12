import { CompressedContextPersister } from "~counselings/domains/compressedContext/compressedContext.persister";
import { CompressedContextReader } from "~counselings/domains/compressedContext/compressedContext.reader";
import { CompressedContextService } from "~counselings/domains/compressedContext/compressedContext.service";
import { CompressedContextRepository } from "~counselings/domains/compressedContext/infrastructures/compressedContext.repository";
import { PsqlCompressedContextRepository } from "~counselings/domains/compressedContext/infrastructures/psql-compressedContext.repository";
import { RepositoryCompressedContextPersister } from "~counselings/domains/compressedContext/infrastructures/repository-compressedContext.persister";
import { RepositoryCompressedContextReader } from "~counselings/domains/compressedContext/infrastructures/repository-compressedContext.reader";

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompressedContextsEntity } from "~common/system/persistences/entities/councels/CompressedContexts.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CompressedContextsEntity])],
  providers: [
    CompressedContextService,
    {
      provide: CompressedContextRepository,
      useClass: PsqlCompressedContextRepository,
    },
    {
      provide: CompressedContextReader,
      useClass: RepositoryCompressedContextReader,
    },
    {
      provide: CompressedContextPersister,
      useClass: RepositoryCompressedContextPersister,
    },
  ],
  exports: [CompressedContextService],
})
export class CompressedContextModule {}
