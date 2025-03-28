import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class CounselTechniquesFacade {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  async createCounselTechnique(params: { name: string; toneId: UniqueEntityId; context: string; instruction: string; messageThreshold: number }) {
    const { name, toneId, context, instruction, messageThreshold } = params;
    return this.counselTechniquesService.create({ name, toneId, context, instruction, messageThreshold });
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
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }) {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = params;
    const technique = await this.counselTechniquesService.getOne({ counselTechniqueId });

    technique.update({ name, context, instruction, messageThreshold });
    return this.counselTechniquesService.update(technique);
  }

  async saveCounselTechniqueSequence(params: { toneId: UniqueEntityId; counselTechniqueIds: UniqueEntityId[] }) {
    const { toneId, counselTechniqueIds } = params;

    // 해당 톤의 기법들 조회
    const existingTechniques = await this.counselTechniquesService.findMany({ toneId });

    // 기존 기법목록 삭제
    existingTechniques.forEach((technique) => {
      technique.delete();
    });

    // 빠른 조회를 위한 Map 생성
    const techniqueMap = new Map(existingTechniques.map((t) => [t.id.getString(), t]));

    const newTechniques: CounselTechniques[] = [];
    // id에 따라 새로운 기법목록 생성
    for (const [index, techniqueId] of counselTechniqueIds.entries()) {
      const technique = techniqueMap.get(techniqueId.getString());
      if (!technique) {
        throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, "Technique not found");
      }
      technique.restore();
      technique.update({ prevTechniqueId: counselTechniqueIds[index - 1] ?? null });
      technique.update({ nextTechniqueId: counselTechniqueIds[index + 1] ?? null });
      newTechniques.push(technique);
    }

    await this.counselTechniquesService.updateMany(existingTechniques);

    return newTechniques;
  }
}
