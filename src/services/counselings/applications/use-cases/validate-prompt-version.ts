import { UseCase } from "~shared/core/applications/UseCase";
import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";
import { ValidatePromptVersionRequest, ValidatePromptVersionResponse } from "~counselings/applications/use-cases/dtos/validate-prompt-version.dto";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export class ValidatePromptVersionUseCase implements UseCase<ValidatePromptVersionRequest, ValidatePromptVersionResponse> {
  constructor(private readonly tonesService: TonesService, private readonly counselorsService: CounselorsService) {}

  async execute(request: ValidatePromptVersionRequest): Promise<ValidatePromptVersionResponse> {
    const { promptVersion } = request;

    const tones = await this.tonesService.findMany({});
    for (const tone of tones) {
      const promptByTone = promptVersion.promptByTones.find((prompt) => prompt.toneId.equals(tone.id));
      if (!promptByTone) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Prompt by tone not found for toneId: ${tone.id}`);
      }
      if (!promptByTone.tonePromptId) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Tone prompt not found for toneId: ${tone.id}`);
      }
      if (!promptByTone.firstCounselTechniqueId) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `First counsel technique not found for toneId: ${tone.id}`);
      }
    }

    const counselors = await this.counselorsService.findMany({});
    for (const counselor of counselors) {
      const promptByCounselor = promptVersion.promptByCounselors.find((prompt) => prompt.counselorId.equals(counselor.id));
      if (!promptByCounselor) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Prompt by counselor not found for counselorId: ${counselor.id}`);
      }
      if (!promptByCounselor.personaPromptId) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Persona prompt not found for counselorId: ${counselor.id}`);
      }
    }

    const isValid = true;

    return { ok: true, isValid };
  }
}
