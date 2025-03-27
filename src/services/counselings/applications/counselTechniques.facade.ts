import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniquesFacade {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  async createCounselTechnique(params: { name: string; toneId: UniqueEntityId; contextId: UniqueEntityId; instructionId: UniqueEntityId }) {
    const { name, toneId, contextId, instructionId } = params;
    return this.counselTechniquesService.create({ name, toneId, contextId, instructionId });
  }

  async findCounselTechniques(params: { name?: string; toneId?: UniqueEntityId }) {
    const { name, toneId } = params;
    return this.counselTechniquesService.findMany({ name, toneId });
  }

  async findCounselTechniqueById(params: { counselTechniqueId: UniqueEntityId }) {
    const { counselTechniqueId } = params;
    return this.counselTechniquesService.getOne({ counselTechniqueId });
  }

  async updateCounselTechnique(params: {
    counselTechniqueId: UniqueEntityId;
    name?: string;
    toneId?: UniqueEntityId;
    contextId?: UniqueEntityId;
    instructionId?: UniqueEntityId;
  }) {
    const { counselTechniqueId, name, toneId, contextId, instructionId } = params;
    const technique = await this.counselTechniquesService.getOne({ counselTechniqueId });

    technique.update({ name, toneId, contextId, instructionId });
    return this.counselTechniquesService.update(technique);
  }

  async saveCounselTechniqueSequence(params: { counselTechniqueIds: UniqueEntityId[] }) {
    const { counselTechniqueIds } = params;

    // 상답 기법 조회
    const counselTechniques = await this.counselTechniquesService.findMany({ ids: counselTechniqueIds });
    if (counselTechniques.length !== counselTechniqueIds.length) {
      throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Counsel techniques not found");
    }

    // 기존 연결 해제
    for (const counselTechnique of counselTechniques) {
      if (counselTechnique.prevTechniqueId !== null) {
        const prevTechnique = await this.counselTechniquesService.findOne({ counselTechniqueId: counselTechnique.prevTechniqueId });
        if (prevTechnique !== null) {
          prevTechnique.update({ nextTechniqueId: null });
          await this.counselTechniquesService.update(prevTechnique);
        }
      }
      if (counselTechnique.nextTechniqueId !== null) {
        const nextTechnique = await this.counselTechniquesService.findOne({ counselTechniqueId: counselTechnique.nextTechniqueId });
        if (nextTechnique !== null) {
          nextTechnique.update({ prevTechniqueId: null });
          await this.counselTechniquesService.update(nextTechnique);
        }
      }
    }

    // 새로운 리스트 생성
    for (const [index, counselTechnique] of counselTechniques.entries()) {
      counselTechnique.update({ prevTechniqueId: counselTechniques[index - 1]?.id ?? null });
      counselTechnique.update({ nextTechniqueId: counselTechniques[index + 1]?.id ?? null });
    }

    await this.counselTechniquesService.updateMany(counselTechniques);

    return { counselTechniques };
  }
}
