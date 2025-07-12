import { CompressedContextPersister } from "~counselings/domains/compressedContext/compressedContext.persister";
import { CompressedContextRepository } from "~counselings/domains/compressedContext/infrastructures/compressedContext.repository";
import {
  CompressedContextNewProps,
  CompressedContexts,
} from "~counselings/domains/compressedContext/models/compressedContext";

import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class RepositoryCompressedContextPersister extends CompressedContextPersister {
  constructor(private readonly compressedContextRepository: CompressedContextRepository) {
    super();
  }

  override async create(newProps: CompressedContextNewProps): Promise<CompressedContexts> {
    const compressedContextResult = CompressedContexts.createNew(newProps);
    if (compressedContextResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, compressedContextResult.error as string);
    }
    return this.compressedContextRepository.save(compressedContextResult.value);
  }

  override async update(compressedContext: CompressedContexts): Promise<CompressedContexts> {
    return this.compressedContextRepository.save(compressedContext);
  }

  override async updateMany(compressedContexts: CompressedContexts[]): Promise<CompressedContexts[]> {
    return this.compressedContextRepository.save(compressedContexts);
  }
}
