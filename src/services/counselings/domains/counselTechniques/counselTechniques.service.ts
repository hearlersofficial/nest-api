import { CounselTechniquesPersister } from "~counselings/domains/counselTechniques/counselTechniques.persister";
import { CounselTechniquesReader } from "~counselings/domains/counselTechniques/counselTechniques.reader";
import { CounselTechniqueInfo } from "~counselings/domains/counselTechniques/models/counselTechnique.info";
import {
  CounselTechniques,
  CounselTechniquesNewProps,
} from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselTechniquesService {
  constructor(
    private readonly counselTechniquesReader: CounselTechniquesReader,
    private readonly counselTechniquesPersister: CounselTechniquesPersister,
  ) {}

  @Transactional()
  async create(newProps: CounselTechniquesNewProps): Promise<CounselTechniqueInfo> {
    const counselTechnique = await this.counselTechniquesPersister.create(newProps);
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  private async findOrdered(props: { firstCounselTechniqueId: UniqueEntityId }): Promise<CounselTechniques[]> {
    const visited = new Set<string>();
    return this.getNextCounselTechniques(props.firstCounselTechniqueId, visited);
  }

  private async getNextCounselTechniques(
    firstCounselTechniqueId: UniqueEntityId,
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
      counselTechniqueId: firstCounselTechniqueId,
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

  async getOrdered(props: { firstCounselTechniqueId: UniqueEntityId }): Promise<CounselTechniqueInfo[]> {
    const orderedTechniques = await this.findOrdered(props);
    return orderedTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }

  async getOne(props: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniqueInfo> {
    const counselTechnique = await this.counselTechniquesReader.findOne(props);
    if (!counselTechnique) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel Technique not found");
    }
    return CounselTechniqueInfo.fromDomain(counselTechnique);
  }

  @Transactional()
  async updateCounselTechnique(
    originalfirstCounselTechniqueId: UniqueEntityId,
    updateParams: {
      counselTechniqueId: UniqueEntityId;
      name?: string;
      context?: string;
      instruction?: string;
      messageThreshold?: number;
    },
  ): Promise<CounselTechniqueInfo[]> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = updateParams;

    const originalTechniques = await this.findOrdered({
      firstCounselTechniqueId: originalfirstCounselTechniqueId,
    });

    // 유지할 부분 및 새롭게 생성할 부분 구분 (구조적 공유)
    const updateIndex = originalTechniques.findIndex((technique) => technique.id.equals(counselTechniqueId));
    if (updateIndex === -1) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel technique not found in original techniques");
    }
    if (originalTechniques[updateIndex].isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot update a temporary technique");
    }

    const techniquesToRecreate = originalTechniques.slice(0, updateIndex + 1);
    const techniquesToKeep = originalTechniques.slice(updateIndex + 1);

    const newOrderedTechniques: CounselTechniques[] = [];
    let nextTechniqueId: UniqueEntityId | null = techniquesToKeep.length > 0 ? techniquesToKeep[0].id : null;

    // 먼저 대상 기법 처리
    const targetTechnique = techniquesToRecreate[techniquesToRecreate.length - 1];
    const newTargetTechnique = await this.counselTechniquesPersister.create({
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

      const newTechnique = await this.counselTechniquesPersister.create({
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
    await this.counselTechniquesPersister.updateMany(newOrderedTechniques);

    // 최종 기법 리스트 생성
    // - 새롭게 생성된 기법들 + 기존 기법들
    const finalTechniques = [...newOrderedTechniques, ...techniquesToKeep];

    return finalTechniques.map((technique) => CounselTechniqueInfo.fromDomain(technique));
  }

  @Transactional()
  async saveCounselTechniqueSequence(props: {
    originalfirstCounselTechniqueId: UniqueEntityId | null;
    toneId: UniqueEntityId;
    counselTechniqueIds: UniqueEntityId[];
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
    let nextTechniqueId: UniqueEntityId | null = techniquesToKeep.length > 0 ? techniquesToKeep[0].id : null;

    for (let i = techniquesToProcess.length - 1; i >= 0; i--) {
      const technique = techniquesToProcess[i];

      // 임시기법은 바로 연결
      if (technique.isTemporary) {
        technique.update({
          isTemporary: false,
          nextTechniqueId: nextTechniqueId,
        });
        nextTechniqueId = technique.id;
        newOrderedTechniques.unshift(technique);
        continue;
      }

      // 기존 기법은 새롭게 복사하여 생성 및 연결
      const newTechnique = await this.counselTechniquesPersister.create({
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
    await this.counselTechniquesPersister.updateMany(newOrderedTechniques);

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
