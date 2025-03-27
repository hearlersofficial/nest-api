import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniquesCriteriaFindMany } from "~counselings/domains/counselTechniques/counselTechniques.criteria";
import { CounselTechniquesPersister } from "~counselings/domains/counselTechniques/counselTechniques.persister";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniques, CounselTechniquesNewProps } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniquesService {
  constructor(private readonly counselTechniquesReader: CounselTechniquesReader, private readonly counselTechniquesPersister: CounselTechniquesPersister) {}

  async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniques> {
    return this.counselTechniquesPersister.create(newProps);
  }

  async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    return this.counselTechniquesPersister.update(counselTechnique);
  }

  async updateMany(counselTechniques: CounselTechniques[]): Promise<CounselTechniques[]> {
    return this.counselTechniquesPersister.updateMany(counselTechniques);
  }

  async findOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques | null> {
    return this.counselTechniquesReader.findOne(props);
  }

  async findFirst(props: { toneId: UniqueEntityId }): Promise<CounselTechniques | null> {
    return this.counselTechniquesReader.findFirst(props);
  }

  async getOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques> {
    const counselTechnique = await this.findOne(props);
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return counselTechnique;
  }

  async getFirst(props: { toneId: UniqueEntityId }): Promise<CounselTechniques> {
    const counselTechnique = await this.findFirst(props);
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return counselTechnique;
  }

  async findMany(props: CounselTechniquesCriteriaFindMany): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniquesReader.findMany(props);
    if (props.ids !== undefined) {
      if (counselTechniques.length !== props.ids.length) {
        throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Techniques not found");
      }
      // ids 순서대로 정렬
      const indexMap = new Map(props.ids.map((id, index) => [id.getString(), index]));
      counselTechniques.sort(
        (a, b) => (indexMap.get(a.id.getString()) ?? Number.MAX_SAFE_INTEGER) - (indexMap.get(b.id.getString()) ?? Number.MAX_SAFE_INTEGER),
      );
    }
    return counselTechniques;
  }
}
