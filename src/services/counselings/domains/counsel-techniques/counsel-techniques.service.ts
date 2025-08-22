import { CounselTechniquesReader } from "~counselings/domains/counsel-techniques/counsel-techniques.reader";
import { CounselTechniquesStore } from "~counselings/domains/counsel-techniques/counsel-techniques.store";
import { CounselTechniqueInfo } from "~counselings/domains/counsel-techniques/models/counsel-technique.info";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counsel-techniques/models/counsel-techniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
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

  private async findOrdered(props: { firstCounselTechniqueId: CounselTechniqueId }): Promise<CounselTechniques[]> {
    const visited = new Set<string>();
    return this.getNextCounselTechniques(props.firstCounselTechniqueId, visited);
  }

  private async getNextCounselTechniques(
    firstCounselTechniqueId: CounselTechniqueId,
    visited: Set<string>,
  ): Promise<CounselTechniques[]> {
    if (visited.has(firstCounselTechniqueId.getString())) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Circular reference detected in counsel techniques.",
      );
    }
    visited.add(firstCounselTechniqueId.getString());

    const firstCounselTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria: { type: "counselTechnique", id: firstCounselTechniqueId },
    });
    if (!firstCounselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    if (!firstCounselTechnique.nextTechniqueId) {
      return [firstCounselTechnique];
    }
    const nextCounselTechniques = await this.getNextCounselTechniques(firstCounselTechnique.nextTechniqueId, visited);
    return [firstCounselTechnique, ...nextCounselTechniques];
  }

  async getOrdered(props: { firstCounselTechniqueId: CounselTechniqueId }): Promise<CounselTechniqueInfo[]> {
    const orderedTechniques = await this.findOrdered(props);
    return orderedTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }

  async getOne(props: { counselTechniqueId: CounselTechniqueId }): Promise<CounselTechniqueInfo> {
    const counselTechnique = await this.counselTechniquesReader.findOne({
      uniqueCriteria: { type: "counselTechnique", id: props.counselTechniqueId },
    });
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  @Transactional()
  async updateCounselTechnique(
    originalfirstCounselTechniqueId: CounselTechniqueId,
    updateParams: {
      counselTechniqueId: CounselTechniqueId;
      name?: string;
      temperature?: number;
      context?: string;
      instruction?: string;
      messageThreshold?: number;
    },
  ): Promise<CounselTechniqueInfo[]> {
    const { counselTechniqueId, name, temperature, context, instruction, messageThreshold } = updateParams;
    const originalTechniques = await this.findOrdered({
      firstCounselTechniqueId: originalfirstCounselTechniqueId,
    });

    const updateIndex = originalTechniques.findIndex((technique) => technique.id.equals(counselTechniqueId));
    if (updateIndex === -1) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel technique not found in original techniques");
    }
    if (!originalTechniques[updateIndex].isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot update a non-temporary technique");
    }

    const targetTechnique = originalTechniques[updateIndex];
    targetTechnique.update({
      name: name ?? targetTechnique.name,
      temperature: temperature ?? targetTechnique.temperature,
      context: context ?? targetTechnique.context,
      instruction: instruction ?? targetTechnique.instruction,
      messageThreshold: messageThreshold ?? targetTechnique.messageThreshold,
    });
    await this.counselTechniquesStore.update(targetTechnique);

    return originalTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }

  @Transactional()
  async saveCounselTechniqueSequence(props: {
    originalfirstCounselTechniqueId: CounselTechniqueId | null;
    toneId: ToneId;
    counselTechniqueIds: CounselTechniqueId[];
  }): Promise<CounselTechniqueInfo[]> {
    const { originalfirstCounselTechniqueId, toneId, counselTechniqueIds } = props;
    if (counselTechniqueIds.length !== new Set(counselTechniqueIds.map((id) => id.getString())).size) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Duplicate Counsel Technique IDs are not allowed");
    }

    const originalTechniques = originalfirstCounselTechniqueId
      ? await this.findOrdered({
          firstCounselTechniqueId: originalfirstCounselTechniqueId,
        })
      : [];

    const newTechniques = await this.counselTechniquesReader.findMany({
      ids: counselTechniqueIds,
    });
    if (newTechniques.length !== counselTechniqueIds.length) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Techniques not found");
    }
    for (const technique of newTechniques) {
      if (technique.toneId.equals(toneId) === false) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "ToneId mismatch");
      }
    }
    // ids 순서대로 정렬
    const indexMap = new Map(counselTechniqueIds.map((id, index) => [id.getString(), index]));
    newTechniques.sort(
      (a, b) =>
        (indexMap.get(a.id.getString()) ?? Number.MAX_SAFE_INTEGER) -
        (indexMap.get(b.id.getString()) ?? Number.MAX_SAFE_INTEGER),
    );

    // 구조적 공유 가능한 부분 탐색
    const { firstIdx, secondIdx } = this.findSharedTechniquesIdx(originalTechniques, newTechniques);
    const techniquesToKeep = originalTechniques.slice(firstIdx);
    const techniquesToProcess = newTechniques.slice(0, secondIdx);

    const newOrderedTechniques: CounselTechniques[] = [];
    let nextTechniqueId: CounselTechniqueId | null = techniquesToKeep.length > 0 ? techniquesToKeep[0].id : null;

    for (let i = techniquesToProcess.length - 1; i >= 0; i--) {
      const technique = techniquesToProcess[i];

      // 임시기법은 바로 연결
      if (technique.isTemporary) {
        technique.update({
          isTemporary: false,
          nextTechniqueId,
        });
        nextTechniqueId = technique.id;
        newOrderedTechniques.unshift(technique);
        continue;
      }

      // 기존 기법은 새롭게 복사하여 생성 및 연결
      const newTechnique = await this.counselTechniquesStore.create({
        name: technique.name,
        toneId: technique.toneId,
        temperature: technique.temperature,
        context: technique.context,
        instruction: technique.instruction,
        messageThreshold: technique.messageThreshold,
      });

      newTechnique.update({
        isTemporary: false,
        nextTechniqueId,
      });

      nextTechniqueId = newTechnique.id;
      newOrderedTechniques.unshift(newTechnique);
    }
    await this.counselTechniquesStore.updateMany(newOrderedTechniques);

    // 최종 기법 리스트 생성
    const finalTechniques = [...newOrderedTechniques, ...techniquesToKeep];

    return finalTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }

  private findSharedTechniquesIdx(
    firstTechniques: CounselTechniques[],
    secondTechniques: CounselTechniques[],
  ): { firstIdx: number; secondIdx: number } {
    let i = firstTechniques.length - 1;
    let j = secondTechniques.length - 1;

    while (i >= 0 && j >= 0 && firstTechniques[i].id.equals(secondTechniques[j].id)) {
      i--;
      j--;
    }
    const firstIdx = i + 1;
    const secondIdx = j + 1;
    return { firstIdx, secondIdx };
  }
}
