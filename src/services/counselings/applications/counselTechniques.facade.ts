import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { GetOrderedCounselTechniquesUseCase } from "~counselings/applications/use-cases/get-ordered-counselTechniques";
import { GetTemporaryPromptVersionUseCase } from "~counselings/applications/use-cases/get-temporary-prompt-version";
import { CounselTechniquesService } from "~counselings/domains/counselTechniques/counselTechniques.service";
import { CounselTechniques } from "~counselings/domains/counselTechniques/models/counselTechniques";
import { PromptVersionsService } from "~counselings/domains/promptVersions/promptVersions.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

@Injectable()
export class CounselTechniquesFacade {
  constructor(
    private readonly counselTechniquesService: CounselTechniquesService,
    private readonly promptVersionsService: PromptVersionsService,
    private readonly getTemporaryPromptVersionUseCase: GetTemporaryPromptVersionUseCase,
    private readonly getOrderedCounselTechniquesUseCase: GetOrderedCounselTechniquesUseCase,
  ) {}

  /*
  기법 생성
  - 새로운 기법은 임시기법(다른 기법들과 링크되지 않은)으로 생성
  - 추후 순서지정 필요
  */
  @Transactional()
  async createCounselTechnique(params: {
    name: string;
    toneId: UniqueEntityId;
    context: string;
    instruction: string;
    messageThreshold: number;
  }): Promise<CounselTechniques> {
    const { name, toneId, context, instruction, messageThreshold } = params;
    return this.counselTechniquesService.create({ name, toneId, context, instruction, messageThreshold });
  }

  async findCounselTechniques(params: { name?: string; toneId?: UniqueEntityId }): Promise<CounselTechniques[]> {
    const { name, toneId } = params;
    return this.counselTechniquesService.findMany({ name, toneId });
  }

  async findCounselTechniqueById(params: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques> {
    const { counselTechniqueId } = params;
    return this.counselTechniquesService.getOne({ counselTechniqueId });
  }

  async findOrderedCounselTechniques(params: { firstCounselTechniqueId: UniqueEntityId }): Promise<CounselTechniques[]> {
    const { firstCounselTechniqueId } = params;
    const orderedTechniquesResult = await this.getOrderedCounselTechniquesUseCase.execute({ firstCounselTechniqueId });
    if (!orderedTechniquesResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get ordered techniques");
    }
    return orderedTechniquesResult.counselTechniques;
  }

  /*
    기법 수정
    - 임시 기법은 수정 불가
    - 수정할 기법 및 연결된 이전 기법들은 복사하여 새로운 기법으로 생성(불변 객체 유지)
  */
  @Transactional()
  async updateCounselTechnique(params: {
    counselTechniqueId: UniqueEntityId;
    name?: string;
    context?: string;
    instruction?: string;
    messageThreshold?: number;
  }): Promise<CounselTechniques[]> {
    const { counselTechniqueId, name, context, instruction, messageThreshold } = params;
    const technique = await this.counselTechniquesService.getOne({ counselTechniqueId });
    if (technique.isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot update a temporary technique");
    }

    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;
    const toneId = technique.toneId;
    const promptByToneResult = temporaryVersion.getPromptByTone(toneId);
    if (promptByToneResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No Prompt found for the tone");
    }
    const { firstCounselTechniqueId } = promptByToneResult.value;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No first counsel technique found");
    }
    const orderedTechniquesResult = await this.getOrderedCounselTechniquesUseCase.execute({ firstCounselTechniqueId });
    if (!orderedTechniquesResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get ordered techniques");
    }
    const orderedTechniques = orderedTechniquesResult.counselTechniques;
    if (orderedTechniques.filter((technique) => technique.id.equals(counselTechniqueId)).length === 0) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Counsel technique not found in the ordered techniques");
    }

    // 수정할 기법까지는 새롭게 생성(nextTechniqueId 변경)
    // 그 이후 기법들은 기존 기법을 사용(구조적 공유)
    const newOrderedTechniques: CounselTechniques[] = [];
    const remainTechniques: CounselTechniques[] = [];
    for (const [index, technique] of orderedTechniques.entries()) {
      const newTechnique = await this.counselTechniquesService.create({
        name: technique.name,
        toneId: technique.toneId,
        context: technique.context,
        instruction: technique.instruction,
        messageThreshold: technique.messageThreshold,
      });
      newTechnique.update({
        isTemporary: false,
        nextTechniqueId: orderedTechniques[index + 1]?.id ?? null,
      });
      newOrderedTechniques.push(newTechnique);
      if (technique.id.equals(counselTechniqueId)) {
        newTechnique.update({ name, context, instruction, messageThreshold });
        remainTechniques.push(...orderedTechniques.slice(index + 1));
        break;
      }
    }
    await this.counselTechniquesService.updateMany(newOrderedTechniques);

    const finalTechniques = [...newOrderedTechniques, ...remainTechniques];

    // 임시 버전 수정
    temporaryVersion.updatePromptByTone({
      toneId,
      firstCounselTechniqueId: finalTechniques[0].id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return finalTechniques;
  }

  /*
    기법 순서 지정
    - 기존 기법 및 임시기법들을 연결
    - 구조적 공유 가능한 기법들은 유지
    - 그 외 기법들은 새롭게 생성(불변 객체 유지)
  */
  @Transactional()
  async saveCounselTechniqueSequence(params: { toneId: UniqueEntityId; counselTechniqueIds: UniqueEntityId[] }) {
    const { toneId, counselTechniqueIds } = params;

    const temporaryVersionResult = await this.getTemporaryPromptVersionUseCase.execute({});
    if (!temporaryVersionResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Temporary version creation failed");
    }
    const temporaryVersion = temporaryVersionResult.temporaryVersion;
    const promptByToneResult = temporaryVersion.getPromptByTone(toneId);
    if (promptByToneResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No Prompt found for the tone");
    }
    const { firstCounselTechniqueId } = promptByToneResult.value;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No first counsel technique found");
    }
    const orderedTechniquesResult = await this.getOrderedCounselTechniquesUseCase.execute({ firstCounselTechniqueId });
    if (!orderedTechniquesResult.ok) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to get ordered techniques");
    }
    const orderedTechniques = orderedTechniquesResult.counselTechniques;

    const techniques = await this.counselTechniquesService.findMany({ ids: counselTechniqueIds });

    const newOrderedTechniques: CounselTechniques[] = [];
    const remainTechniques: CounselTechniques[] = [];

    // 구조적 공유 가능한 부분 탐색색
    const { firstIdx, secondIdx } = this.findSharedTechniquesIdx(orderedTechniques, techniques);
    remainTechniques.push(...orderedTechniques.slice(firstIdx));

    for (const [index, technique] of techniques.entries()) {
      if (index >= secondIdx) {
        break;
      }
      // 임시기법은 바로 연결결
      if (technique.isTemporary) {
        technique.update({
          isTemporary: false,
          nextTechniqueId: techniques[index + 1]?.id ?? null,
        });
        newOrderedTechniques.push(technique);
        continue;
      }

      // 기존 기법은 새롭게 복사하여 생성 및 연결
      const newTechnique = await this.counselTechniquesService.create({
        name: technique.name,
        toneId: technique.toneId,
        context: technique.context,
        instruction: technique.instruction,
        messageThreshold: technique.messageThreshold,
      });
      newTechnique.update({
        isTemporary: false,
        nextTechniqueId: techniques[index + 1]?.id ?? null,
      });
      newOrderedTechniques.push(newTechnique);
    }
    await this.counselTechniquesService.updateMany(newOrderedTechniques);

    const finalTechniques = [...newOrderedTechniques, ...remainTechniques];

    // 임시 버전 수정
    temporaryVersion.updatePromptByTone({
      toneId,
      firstCounselTechniqueId: finalTechniques[0].id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return finalTechniques;
  }

  private findSharedTechniquesIdx(firstTechniques: CounselTechniques[], secondTechniques: CounselTechniques[]): { firstIdx: number; secondIdx: number } {
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
