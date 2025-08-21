import {
  CounselorScopedPrompts,
  CounselorScopedPromptsNewProps,
} from "~counselings/domains/promptVersions/models/counselorScopedPrompts";
import {
  ToneScopedPrompts,
  ToneScopedPromptsNewProps,
} from "~counselings/domains/promptVersions/models/toneScopedPrompts";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselorId } from "~common/shared-kernel/identifiers/counselor.id";
import { PersonaPromptId } from "~common/shared-kernel/identifiers/persona-prompt.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { TonePromptId } from "~common/shared-kernel/identifiers/tone-prompt.id";
import { Dayjs } from "dayjs";

export interface PromptVersionsNewProps {
  name: string;
  description: string;
  counselorScopedPrompts: Omit<CounselorScopedPromptsNewProps, "promptVersionId">[];
  toneScopedPrompts: Omit<ToneScopedPromptsNewProps, "promptVersionId">[];
  aiModel: AiModel;
}

export interface PromptVersionsProps extends PromptVersionsNewProps {
  isActive: boolean;
  isTemporary: boolean;
  isBookmarked: boolean;
  counselorScopedPrompts: CounselorScopedPrompts[];
  toneScopedPrompts: ToneScopedPrompts[];
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptVersions extends AggregateRoot<PromptVersionsProps, PromptVersionId> {
  private constructor(props: PromptVersionsProps, id: PromptVersionId) {
    super(props, id);
  }

  public static create(props: PromptVersionsProps, id: PromptVersionId): Result<PromptVersions> {
    const promptVersions = new PromptVersions(props, id);
    const validateResult = promptVersions.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptVersions>(validateResult.error as string);
    }
    return Result.ok<PromptVersions>(promptVersions);
  }

  public static createNew(newProps: PromptVersionsNewProps): Result<PromptVersions> {
    const now = getNowDayjs();
    const newId = new PromptVersionId();

    const counselorScopedPromptsResults = newProps.counselorScopedPrompts.map((counselorScopedPrompt) =>
      CounselorScopedPrompts.createNew({
        ...counselorScopedPrompt,
        promptVersionId: newId,
      }),
    );
    const toneScopedPromptsResults = newProps.toneScopedPrompts.map((toneScopedPrompt) =>
      ToneScopedPrompts.createNew({
        ...toneScopedPrompt,
        promptVersionId: newId,
      }),
    );
    const failResult = Result.getFailResultIfExist([...counselorScopedPromptsResults, ...toneScopedPromptsResults]);
    if (failResult) {
      return Result.fail<PromptVersions>(failResult.error);
    }

    return this.create(
      {
        ...newProps,
        counselorScopedPrompts: counselorScopedPromptsResults.map(
          (counselorScopedPrompt) => counselorScopedPrompt.value,
        ),
        toneScopedPrompts: toneScopedPromptsResults.map((toneScopedPrompt) => toneScopedPrompt.value),
        isActive: false,
        isTemporary: true,
        isBookmarked: false,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  validateDomain(): Result<void> {
    // name 검증
    if (!isDefined(this.props.name)) {
      return Result.fail<void>("[PromptVersions] Name은 필수입니다");
    }
    if (this.props.name.length < 1) {
      return Result.fail<void>("[PromptVersions] Name은 최소 1자 이상이어야 합니다");
    }

    // description 검증
    if (!isDefined(this.props.description)) {
      return Result.fail<void>("[PromptVersions] Description은 필수입니다");
    }

    // isActive 검증
    if (!isDefined(this.props.isActive)) {
      return Result.fail<void>("[PromptVersions] isActive는 필수입니다");
    }

    // isTemporary 검증
    if (!isDefined(this.props.isTemporary)) {
      return Result.fail<void>("[PromptVersions] isTemporary는 필수입니다");
    }

    if (this.props.isActive && this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] isTemporary가 true일 경우 isActive는 false여야 합니다");
    }

    // isBookmarked 검증
    if (!isDefined(this.props.isBookmarked)) {
      return Result.fail<void>("[PromptVersions] isBookmarked는 필수입니다");
    }

    // gptModel 검증
    if (!isDefined(this.props.aiModel)) {
      return Result.fail<void>("[PromptVersions] aiModel은 필수입니다");
    }

    // counselorScopedPrompts 검증
    if (this.props.counselorScopedPrompts.length > 0) {
      for (const counselorScopedPrompt of this.props.counselorScopedPrompts) {
        if (!counselorScopedPrompt.promptVersionId.equals(this.id)) {
          return Result.fail<void>("[PromptVersions] CounselorScopedPrompts의 ID가 일치하지 않습니다");
        }
      }
    }

    // toneScopedPrompts 검증
    if (this.props.toneScopedPrompts.length > 0) {
      for (const toneScopedPrompt of this.props.toneScopedPrompts) {
        if (!toneScopedPrompt.promptVersionId.equals(this.id)) {
          return Result.fail<void>("[PromptVersions] ToneScopedPrompts의 ID가 일치하지 않습니다");
        }
      }
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[PromptVersions] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[PromptVersions] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get counselorScopedPrompts(): CounselorScopedPrompts[] {
    return this.props.counselorScopedPrompts;
  }

  get toneScopedPrompts(): ToneScopedPrompts[] {
    return this.props.toneScopedPrompts;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isTemporary(): boolean {
    return this.props.isTemporary;
  }

  get isBookmarked(): boolean {
    return this.props.isBookmarked;
  }

  get aiModel(): AiModel {
    return this.props.aiModel;
  }

  get createdAt(): Dayjs {
    return this.props.createdAt;
  }

  get updatedAt(): Dayjs {
    return this.props.updatedAt;
  }

  get deletedAt(): Dayjs | null {
    return this.props.deletedAt;
  }

  // Methods
  public delete(): Result<void> {
    if (this.props.isActive === true) {
      return Result.fail<void>("[PromptVersions] Active PromptVersion cannot be deleted.");
    }
    this.props.deletedAt = getNowDayjs();
    return Result.ok();
  }

  public restore(): Result<void> {
    this.props.deletedAt = null;
    return Result.ok();
  }

  public activate(): Result<void> {
    if (this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Temporary PromptVersion cannot be activated.");
    }
    this.props.isActive = true;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public deactivate(): Result<void> {
    if (!this.isActive) {
      return Result.fail<void>("[PromptVersions] PromptVersion is already inactive.");
    }
    this.props.isActive = false;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public saveVersion(props: {
    name: string;
    description: string;
    isBookmarked: boolean;
    aiModel: AiModel;
  }): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary versions can be saved.");
    }
    this.props.name = props.name;
    this.props.description = props.description;
    this.props.isBookmarked = props.isBookmarked;
    this.props.aiModel = props.aiModel;
    this.props.isTemporary = false;
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public updateToneScopedPrompt(props: {
    toneId: ToneId;
    tonePromptId?: TonePromptId;
    firstCounselTechniqueId?: CounselTechniqueId;
  }): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary versions can be updated.");
    }
    for (const toneScopedPrompt of this.props.toneScopedPrompts) {
      if (toneScopedPrompt.toneId.equals(props.toneId)) {
        toneScopedPrompt.update({
          tonePromptId: props.tonePromptId,
          firstCounselTechniqueId: props.firstCounselTechniqueId,
        });
        this.props.updatedAt = getNowDayjs();
        return Result.ok();
      }
    }
    const newToneScopedPrompt = ToneScopedPrompts.createNew({
      promptVersionId: this.id,
      toneId: props.toneId,
      tonePromptId: props.tonePromptId ?? null,
      firstCounselTechniqueId: props.firstCounselTechniqueId ?? null,
    });
    if (newToneScopedPrompt.isFailure) {
      return Result.fail<void>(newToneScopedPrompt.error as string);
    }
    this.props.toneScopedPrompts.push(newToneScopedPrompt.value);
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public updateCounselorScopedPrompt(props: {
    counselorId: CounselorId;
    personaPromptId: PersonaPromptId;
  }): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary versions can be updated.");
    }
    for (const counselorScopedPrompt of this.props.counselorScopedPrompts) {
      if (counselorScopedPrompt.counselorId.equals(props.counselorId)) {
        counselorScopedPrompt.update({ personaPromptId: props.personaPromptId });
        this.props.updatedAt = getNowDayjs();
        return Result.ok();
      }
    }
    const newCounselorScopedPrompt = CounselorScopedPrompts.createNew({
      promptVersionId: this.id,
      counselorId: props.counselorId,
      personaPromptId: props.personaPromptId,
    });
    if (newCounselorScopedPrompt.isFailure) {
      return Result.fail<void>(newCounselorScopedPrompt.error as string);
    }
    this.props.counselorScopedPrompts.push(newCounselorScopedPrompt.value);
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public updateBasicInfo(props: {
    name?: string;
    description?: string;
    isBookmarked?: boolean;
    aiModel?: AiModel;
  }): Result<void> {
    if (props.name !== undefined) {
      this.props.name = props.name;
    }
    if (props.description !== undefined) {
      this.props.description = props.description;
    }
    if (props.isBookmarked !== undefined) {
      this.props.isBookmarked = props.isBookmarked;
    }
    if (props.aiModel !== undefined) {
      this.props.aiModel = props.aiModel;
    }
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }
}
