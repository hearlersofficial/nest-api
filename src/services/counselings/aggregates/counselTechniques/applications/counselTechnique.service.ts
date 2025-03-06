import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniquePersistor } from "~counselings/aggregates/counselTechniques/applications/tools/counselTechnique.persistor";
import { CounselTechniqueReader } from "~counselings/aggregates/counselTechniques/applications/tools/counselTechnique.reader";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/aggregates/counselTechniques/domain/counselTechniques";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CounselTechniqueService {
  constructor(
    private readonly counselTechniqueReader: CounselTechniqueReader,
    private readonly counselTechniquePersistor: CounselTechniquePersistor,
  ) {}

  async create(counselTechniqueNewProps: CounselTechniquesNewProps): Promise<CounselTechniques> {
    const counselTechniqueOrError = CounselTechniques.createNew(counselTechniqueNewProps);
    if (counselTechniqueOrError.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, counselTechniqueOrError.error as string);
    }
    const counselTechnique = counselTechniqueOrError.value;
    const createdCounselTechnique = await this.counselTechniquePersistor.create(counselTechnique);
    return createdCounselTechnique;
  }

  async update(counselTechnique: CounselTechniques): Promise<CounselTechniques> {
    const updatedCounselTechnique = await this.counselTechniquePersistor.update(counselTechnique);
    return updatedCounselTechnique;
  }

  async findOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques | null> {
    const counselTechnique = await this.counselTechniqueReader.findOne(counselTechniqueId);
    return counselTechnique;
  }

  async findFirst(props: { stage: CounselTechniqueStage; toneId?: UniqueEntityId }): Promise<CounselTechniques | null> {
    const counselTechnique = await this.counselTechniqueReader.findFirst(props);
    return counselTechnique;
  }

  async findAll(): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueReader.findAll();
    return counselTechniques;
  }

  async findMany(props: { name?: string }): Promise<CounselTechniques[]> {
    const counselTechniques = await this.counselTechniqueReader.findMany(props);
    return counselTechniques;
  }

  async getOne(counselTechniqueId: UniqueEntityId): Promise<CounselTechniques> {
    const counselTechnique: CounselTechniques | null = await this.findOne(counselTechniqueId);
    if (!counselTechnique) {
      throw new NotFoundException("CounselTechnique not found");
    }
    return counselTechnique;
  }

  async getFirst(props: { stage: CounselTechniqueStage; toneId?: UniqueEntityId }): Promise<CounselTechniques> {
    const counselTechnique: CounselTechniques | null = await this.findFirst(props);
    if (!counselTechnique) {
      throw new NotFoundException("CounselTechnique not found");
    }
    return counselTechnique;
  }

  async getAll(): Promise<CounselTechniques[]> {
    const counselTechniques = await this.findAll();
    if (counselTechniques.length === 0) {
      throw new NotFoundException("CounselTechniques not found");
    }
    return counselTechniques;
  }

  async getMany(props: { name?: string }): Promise<CounselTechniques[]> {
    const counselTechniques = await this.findMany(props);
    if (counselTechniques.length === 0) {
      throw new NotFoundException("CounselTechniques not found");
    }
    return counselTechniques;
  }
}
