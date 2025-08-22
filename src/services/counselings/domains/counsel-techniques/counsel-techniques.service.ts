import * as CounselTechniquesCriteria from "~counselings/domains/counsel-techniques/counsel-techniques.criteria";
import { CounselTechniquesReader } from "~counselings/domains/counsel-techniques/counsel-techniques.reader";
import { CounselTechniquesStore } from "~counselings/domains/counsel-techniques/counsel-techniques.store";
import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import { CounselTechniquesNewProps } from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselTechniquesService {
  constructor(
    private readonly counselTechniquesReader: CounselTechniquesReader,
    private readonly counselTechniquesStore: CounselTechniquesStore,
  ) {}

  @Transactional()
  async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniqueInfo> {
    const counselTechnique = await this.counselTechniquesStore.create(newProps);
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  async getOne(props: {
    uniqueCriteria: CounselTechniquesCriteria.UniqueKey;
    options?: CounselTechniquesCriteria.FindOneOptions;
  }): Promise<CounselTechniqueInfo> {
    const { uniqueCriteria, options } = props;
    const counselTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria,
      options,
    });
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  @Transactional()
  async updateCounselTechnique(props: {
    counselTechniqueId: CounselTechniqueId;
    name?: string;
    temperature?: number;
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }): Promise<CounselTechniqueInfo> {
    const { counselTechniqueId, name, temperature, context, instruction, messageThreshold } = props;
    const originalTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria: { type: "counselTechnique", id: counselTechniqueId },
    });
    if (!originalTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel technique not found");
    }

    originalTechnique.update({
      name: name ?? originalTechnique.name,
      temperature: temperature ?? originalTechnique.temperature,
      context: context ?? originalTechnique.context,
      instruction: instruction ?? originalTechnique.instruction,
      messageThreshold: messageThreshold ?? originalTechnique.messageThreshold,
    });
    await this.counselTechniquesStore.update(originalTechnique);

    return CounselTechniqueInfo.fromDomain(originalTechnique);
  }
}
