import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselTechniquesFacade {
  constructor(private readonly counselTechniquesService: CounselTechniquesService) {}

  @Transactional()
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

  @Transactional()
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

  @Transactional()
  async saveCounselTechniqueSequence(params: { toneId: UniqueEntityId; counselTechniqueIds: UniqueEntityId[] }) {
    const { toneId, counselTechniqueIds } = params;

    // 해당 톤의 기법들 조회
    const existingTechniques = await this.counselTechniquesService.findMany({ toneId });

    // 빠른 조회를 위한 Map 생성
    const techniqueMap = new Map(existingTechniques.map((t) => [t.id.getString(), t]));

    // ID 유효성 검증 - 모든 ID가 유효한지 먼저 확인
    for (const techniqueId of counselTechniqueIds) {
      if (!techniqueMap.has(techniqueId.getString())) {
        throw new HttpStatusBasedRpcException(HttpStatus.NOT_FOUND, `Technique with ID ${techniqueId.getString()} not found`);
      }
    }

    // 모든 기법 논리적 삭제 표시
    existingTechniques.forEach((technique) => {
      technique.delete();
    });

    // 새 순서로 기법 복원 및 관계 설정
    const newTechniques: CounselTechniques[] = [];
    for (const [index, techniqueId] of counselTechniqueIds.entries()) {
      const technique = techniqueMap.get(techniqueId.getString())!; // 존재 검증 완료
      technique.restore();
      technique.update({
        prevTechniqueId: counselTechniqueIds[index - 1] ?? null,
        nextTechniqueId: counselTechniqueIds[index + 1] ?? null,
      });
      newTechniques.push(technique);
    }

    await this.counselTechniquesService.updateMany(existingTechniques);

    return newTechniques;
  }
}
