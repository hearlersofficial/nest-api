import { ContextDomain } from "~counselings/domains/counsels/analyzers/context-domain.registry";
import { CounselContextsProps } from "~counselings/domains/counsels/models/counsel-contexts";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";

export interface DomainAnalyzer {
  readonly domain: ContextDomain;
  analyze: (counsel: Counsels) => Promise<Partial<CounselContextsProps>>;
}

@Injectable()
export abstract class BaseDomainAnalyzer implements DomainAnalyzer {
  abstract readonly domain: ContextDomain;
  abstract analyze(counsel: Counsels): Promise<Partial<CounselContextsProps>>;
}
