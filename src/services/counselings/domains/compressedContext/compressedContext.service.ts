import { CompressedContextCriteriaFindMany } from "~counselings/domains/compressedContext/compressedContext.criteria";
import { CompressedContextPersister } from "~counselings/domains/compressedContext/compressedContext.persister";
import { CompressedContextReader } from "~counselings/domains/compressedContext/compressedContext.reader";
import { CompressedContextNewProps } from "~counselings/domains/compressedContext/models/compressedContext";
import { CompressedContextInfo } from "~counselings/domains/compressedContext/models/compressedContext.info";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CompressedContextId } from "~common/shared-kernel/identifiers/compressed-context.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CompressedContextService {
  constructor(
    private readonly compressedContextPersister: CompressedContextPersister,
    private readonly compressedContextReader: CompressedContextReader,
  ) {}

  @Transactional()
  async create(newProps: CompressedContextNewProps): Promise<CompressedContextInfo> {
    const compressedContext = await this.compressedContextPersister.create(newProps);
    return CompressedContextInfo.fromDomain(compressedContext);
  }

  async getOne(props: { compressedContextId: CompressedContextId }): Promise<CompressedContextInfo> {
    const compressedContext = await this.compressedContextReader.findOne(props);
    if (!compressedContext) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Compressed context not found");
    }
    return CompressedContextInfo.fromDomain(compressedContext);
  }

  async getMany(props: CompressedContextCriteriaFindMany): Promise<CompressedContextInfo[]> {
    const compressedContexts = await this.compressedContextReader.findMany(props);
    return compressedContexts.map(CompressedContextInfo.fromDomain);
  }
}
