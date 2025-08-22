import {
  ValidatePromptVersionRequest,
  ValidatePromptVersionResponse,
} from "~counselings/applications/counsel-prompt-managements/use-cases/dtos/validate-prompt-version.dto";
import { CounselorsService } from "~counselings/domains/counselors/counselors.service";
import { TonesService } from "~counselings/domains/tones/tones.service";

import { HttpStatus, Injectable } from "@nestjs/common";
import { UseCase } from "~common/shared-kernel/interfaces/use-case";
import { HttpStatusBasedRpcException } from "~common/system/filters/exceptions";

@Injectable()
export class ValidatePromptVersionUseCase
  implements UseCase<ValidatePromptVersionRequest, ValidatePromptVersionResponse>
{
  constructor(
    private readonly tonesService: TonesService,
    private readonly counselorsService: CounselorsService,
  ) {}

  async execute(request: ValidatePromptVersionRequest): Promise<ValidatePromptVersionResponse> {
    const { promptVersion } = request;

    const tones = await this.tonesService.findMany({});
    for (const tone of tones) {
      const toneScopedPrompt = promptVersion.toneScopedPrompts.find((prompt) => prompt.toneId.equals(tone.id));
      if (!toneScopedPrompt) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.BAD_REQUEST,
          `Prompt by tone not found for toneId: ${tone.id}`,
        );
      }
      if (!toneScopedPrompt.tonePromptId) {
        throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, `Tone prompt not found for toneId: ${tone.id}`);
      }
      if (!toneScopedPrompt.firstCounselTechniqueId) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.BAD_REQUEST,
          `First counsel technique not found for toneId: ${tone.id}`,
        );
      }
    }

    const counselors = await this.counselorsService.findMany({});
    for (const counselor of counselors) {
      const counselorScopedPrompt = promptVersion.counselorScopedPrompts.find((prompt) =>
        prompt.counselorId.equals(counselor.id),
      );
      if (!counselorScopedPrompt) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.BAD_REQUEST,
          `Prompt by counselor not found for counselorId: ${counselor.id}`,
        );
      }
      if (!counselorScopedPrompt.personaPromptId) {
        throw new HttpStatusBasedRpcException(
          HttpStatus.BAD_REQUEST,
          `Persona prompt not found for counselorId: ${counselor.id}`,
        );
      }
    }

    const isValid = true;

    return { ok: true, isValid };
  }
}
