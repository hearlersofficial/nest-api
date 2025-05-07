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

  async getOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques> {
    const counselTechnique = await this.findOne(props);
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

  async getOrdered(props: { firstCounselTechniqueId: UniqueEntityId }): Promise<CounselTechniques[]> {
    const visited = new Set<string>();
    const counselTechniques = await this.getNextCounselTechniques(props.firstCounselTechniqueId, visited);
    return counselTechniques;
  }

  private async getNextCounselTechniques(firstCounselTechniqueId: UniqueEntityId, visited: Set<string>): Promise<CounselTechniques[]> {
    if (visited.has(firstCounselTechniqueId.getString())) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Circular reference detected in counsel techniques.");
    }
    visited.add(firstCounselTechniqueId.getString());

    const firstCounselTechnique = await this.getOne({ counselTechniqueId: firstCounselTechniqueId });
    if (!firstCounselTechnique.nextTechniqueId) {
      return [firstCounselTechnique];
    }
    const nextCounselTechniques = await this.getNextCounselTechniques(firstCounselTechnique.nextTechniqueId, visited);
    return [firstCounselTechnique, ...nextCounselTechniques];
  }

  async updateCounselTechnique(
    originalTechniques: CounselTechniques[],
    updateParams: {
      counselTechniqueId: UniqueEntityId;
      name?: string;
      context?: string;
      instruction?: string;
      messageThreshold?: number;
    },
  ): Promise<CounselTechniques[]> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = updateParams;

    // 유지할 부분 및 새롭게 생성할 부분 구분 (구조적 공유)
    const updateIndex = originalTechniques.findIndex((technique) => technique.id.equals(counselTechniqueId));
    if (updateIndex === -1) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel technique not found in original techniques");
    }
    const techniquesToRecreate = originalTechniques.slice(0, updateIndex + 1);
    const techniquesToKeep = originalTechniques.slice(updateIndex + 1);

    const newOrderedTechniques: CounselTechniques[] = [];
    let nextTechniqueId: UniqueEntityId | null = techniquesToKeep.length > 0 ? techniquesToKeep[0].id : null;

    // 먼저 대상 기법 처리
    const targetTechnique = techniquesToRecreate[techniquesToRecreate.length - 1];
    const newTargetTechnique = await this.create({
      name: name ?? targetTechnique.name,
      toneId: targetTechnique.toneId,
      context: context ?? targetTechnique.context,
      instruction: instruction ?? targetTechnique.instruction,
      messageThreshold: messageThreshold ?? targetTechnique.messageThreshold,
    });

    newTargetTechnique.update({
      isTemporary: false,
      nextTechniqueId: nextTechniqueId,
    });

    nextTechniqueId = newTargetTechnique.id;
    newOrderedTechniques.unshift(newTargetTechnique);

    // 이전 기법들을 역순으로 생성하여 연결
    for (let i = techniquesToRecreate.length - 2; i >= 0; i--) {
      const technique = techniquesToRecreate[i];

      const newTechnique = await this.create({
        name: technique.name,
        toneId: technique.toneId,
        context: technique.context,
        instruction: technique.instruction,
        messageThreshold: technique.messageThreshold,
      });

      newTechnique.update({
        isTemporary: false,
        nextTechniqueId: nextTechniqueId,
      });

      nextTechniqueId = newTechnique.id;
      newOrderedTechniques.unshift(newTechnique);
    }
    await this.updateMany(newOrderedTechniques);

    // 최종 기법 리스트 생성
    // - 새롭게 생성된 기법들 + 기존 기법들
    const finalTechniques = [...newOrderedTechniques, ...techniquesToKeep];

    return finalTechniques;
  }
}
