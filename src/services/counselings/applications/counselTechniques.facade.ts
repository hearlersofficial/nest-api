import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
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

  async findCounselTechniqueById(params: { counselTechniqueId: UniqueEntityId }): Promise<CounselTechniques> {
    const { counselTechniqueId } = params;
    return this.counselTechniquesService.getOne({ counselTechniqueId });
  }

  async findOrderedCounselTechniques(params: {
    firstCounselTechniqueId: UniqueEntityId;
  }): Promise<CounselTechniques[]> {
    const { firstCounselTechniqueId } = params;
    const orderedTechniques = await this.counselTechniquesService.getOrdered({ firstCounselTechniqueId });
    return orderedTechniques;
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
    const { counselTechniqueId } = params;
    const technique = await this.counselTechniquesService.getOne({ counselTechniqueId });
    if (technique.isTemporary) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "Cannot update a temporary technique");
    }

    const temporaryVersion = await this.promptVersionsService.getTemporaryOne();
    const toneId = technique.toneId;
    const toneScopedPromptResult = temporaryVersion.getToneScopedPrompt(toneId);
    if (toneScopedPromptResult.isFailure) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No Prompt found for the tone");
    }
    const { firstCounselTechniqueId } = toneScopedPromptResult.value;
    if (!firstCounselTechniqueId) {
      throw new HttpStatusBasedRpcException(HttpStatus.INTERNAL_SERVER_ERROR, "No first counsel technique found");
    }
    const orderedTechniques = await this.counselTechniquesService.getOrdered({ firstCounselTechniqueId });

    const finalTechniques = await this.counselTechniquesService.updateCounselTechnique(orderedTechniques, params);

    // 임시 버전 수정
    temporaryVersion.updateToneScopedPrompt({
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

    const temporaryVersion = await this.promptVersionsService.getTemporaryOne();
    const toneScopedPromptResult = temporaryVersion.getToneScopedPrompt(toneId);
    const firstCounselTechniqueId = toneScopedPromptResult.isSuccess
      ? toneScopedPromptResult.value.firstCounselTechniqueId
      : null;

    const orderedTechniques: CounselTechniques[] = firstCounselTechniqueId
      ? await this.counselTechniquesService.getOrdered({ firstCounselTechniqueId })
      : [];
    const techniques = await this.counselTechniquesService.findMany({ ids: counselTechniqueIds });

    for (const technique of techniques) {
      if (technique.toneId.equals(toneId) === false) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "ToneId mismatch");
      }
    }

    const finalTechniques = await this.counselTechniquesService.saveCounselTechniqueSequence(
      orderedTechniques,
      techniques,
    );

    // 임시 버전 수정
    temporaryVersion.updateToneScopedPrompt({
      toneId,
      firstCounselTechniqueId: finalTechniques[0].id,
    });
    await this.promptVersionsService.update(temporaryVersion);

    return finalTechniques;
  }
}
