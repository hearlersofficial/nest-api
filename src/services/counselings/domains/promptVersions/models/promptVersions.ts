import { CounselorScopedPrompts } from "~counselings/domains/promptVersions/models/counselorScopedPrompts";
import { ToneScopedPrompts } from "~counselings/domains/promptVersions/models/toneScopedPrompts";
import { AiModel } from "~proto/com/hearlers/v1/model/counsel_prompt_pb";

import { getNowDayjs } from "~common/shared/utils/date";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { UniqueEntityId } from "~common/shared-kernel/domains/unique-entity-id";
import { Dayjs } from "dayjs";

export interface PromptVersionsNewProps {}

export interface PromptVersionsProps extends PromptVersionsNewProps {
  name: string;
  description: string;
  counselorScopedPrompts: CounselorScopedPrompts[];
  toneScopedPrompts: ToneScopedPrompts[];
  isActive: boolean;
  isTemporary: boolean;
  isBookmarked: boolean;
  aiModel: AiModel;

  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class PromptVersions extends AggregateRoot<PromptVersionsProps> {
  private constructor(props: PromptVersionsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: PromptVersionsProps, id: UniqueEntityId): Result<PromptVersions> {
    const promptVersions = new PromptVersions(props, id);
    const validateResult = promptVersions.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<PromptVersions>(validateResult.error as string);
    }
    return Result.ok<PromptVersions>(promptVersions);
  }

  public static createNew(newProps: PromptVersionsNewProps): Result<PromptVersions> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    return this.create(
      {
        ...newProps,
        name: "Default Name",
        description: "Default Description",
        counselorScopedPrompts: [],
        toneScopedPrompts: [],
        isActive: false,
        isTemporary: true,
        isBookmarked: false,
        aiModel: AiModel.GPT_4O,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
  }

  public static clone(promptVersion: PromptVersions): Result<PromptVersions> {
    if (promptVersion.isTemporary) {
      return Result.fail<PromptVersions>("[PromptVersions]Temporary PromptVersion cannot be cloned.");
    }
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
    const clonedVersionResult = this.create(
      {
        name: "Temporary name",
        description: "Temporary description",
        counselorScopedPrompts: [],
        toneScopedPrompts: [],
        isActive: false,
        isTemporary: true,
        isBookmarked: false,
        aiModel: promptVersion.aiModel,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );
    if (clonedVersionResult.isFailure) {
      return Result.fail<PromptVersions>(clonedVersionResult.error as string);
    }
    const clonedVersion = clonedVersionResult.value;

    for (const counselorScopedPrompt of promptVersion.counselorScopedPrompts) {
      const clonedPromptByCounselor = CounselorScopedPrompts.createNew({
        promptVersionId: clonedVersion.id,
        counselorId: counselorScopedPrompt.counselorId,
        personaPromptId: counselorScopedPrompt.personaPromptId,
      });
      if (clonedPromptByCounselor.isFailure) {
        return Result.fail<PromptVersions>(clonedPromptByCounselor.error as string);
      }
      clonedVersion.props.counselorScopedPrompts.push(clonedPromptByCounselor.value);
    }

    for (const toneScopedPrompt of promptVersion.toneScopedPrompts) {
      const clonedPromptByTone = ToneScopedPrompts.createNew({
        promptVersionId: clonedVersion.id,
        toneId: toneScopedPrompt.toneId,
        tonePromptId: toneScopedPrompt.tonePromptId,
        firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId,
      });
      if (clonedPromptByTone.isFailure) {
        return Result.fail<PromptVersions>(clonedPromptByTone.error as string);
      }
      clonedVersion.props.toneScopedPrompts.push(clonedPromptByTone.value);
    }

    return Result.ok<PromptVersions>(clonedVersion);
  }

  validateDomain(): Result<void> {
    // name 검증
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[PromptVersions] Name은 필수입니다");
    }
    if (this.props.name.length < 1) {
      return Result.fail<void>("[PromptVersions] Name은 최소 1자 이상이어야 합니다");
    }

    // description 검증
    if (this.props.description === null || this.props.description === undefined) {
      return Result.fail<void>("[PromptVersions] Description은 필수입니다");
    }

    // isActive 검증
    if (this.props.isActive === null || this.props.isActive === undefined) {
      return Result.fail<void>("[PromptVersions] isActive는 필수입니다");
    }

    // isTemporary 검증
    if (this.props.isTemporary === null || this.props.isTemporary === undefined) {
      return Result.fail<void>("[PromptVersions] isTemporary는 필수입니다");
    }

    if (this.props.isActive && this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] isTemporary가 true일 경우 isActive는 false여야 합니다");
    }

    // isBookmarked 검증
    if (this.props.isBookmarked === null || this.props.isBookmarked === undefined) {
      return Result.fail<void>("[PromptVersions] isBookmarked는 필수입니다");
    }

    // gptModel 검증
    if (this.props.aiModel === null || this.props.aiModel === undefined) {
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
    if (this.props.createdAt === null || this.props.createdAt === undefined) {
      return Result.fail<void>("[PromptVersions] 생성 시간은 필수입니다");
    }
    if (this.props.updatedAt === null || this.props.updatedAt === undefined) {
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

  public updateCounselorScopedPrompt(props: {
    counselorId: UniqueEntityId;
    personaPromptId: UniqueEntityId;
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

  public updateToneScopedPrompt(props: {
    toneId: UniqueEntityId;
    tonePromptId?: UniqueEntityId;
    firstCounselTechniqueId?: UniqueEntityId;
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

  public clonePrompts(promptVersion: PromptVersions): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary PromptVersion can clone prompts.");
    }
    if (this.props.isActive) {
      return Result.fail<void>("[PromptVersions] Active PromptVersion cannot clone prompts.");
    }
    if (promptVersion.isTemporary) {
      return Result.fail<void>("[PromptVersions] Cannot clone from a temporary PromptVersion.");
    }

    this.props.isTemporary = true;
    this.props.isActive = false;
    this.props.name = "임시 버전";
    this.props.description = "현재 수정 중인 임시 버전입니다. (부모 버전: " + promptVersion.name + ")";
    this.props.updatedAt = getNowDayjs();

    for (const existingCounselorScopedPrompt of this.props.counselorScopedPrompts) {
      existingCounselorScopedPrompt.delete();
    }
    for (const existingToneScopedPrompt of this.props.toneScopedPrompts) {
      existingToneScopedPrompt.delete();
    }

    for (const counselorScopedPrompt of promptVersion.counselorScopedPrompts) {
      const clonedCounselorScopedPrompt = CounselorScopedPrompts.createNew({
        promptVersionId: this.id,
        counselorId: counselorScopedPrompt.counselorId,
        personaPromptId: counselorScopedPrompt.personaPromptId,
      });
      if (clonedCounselorScopedPrompt.isFailure) {
        return Result.fail<void>(clonedCounselorScopedPrompt.error as string);
      }
      this.props.counselorScopedPrompts.push(clonedCounselorScopedPrompt.value);
    }

    for (const toneScopedPrompt of promptVersion.toneScopedPrompts) {
      const clonedToneScopedPrompt = ToneScopedPrompts.createNew({
        promptVersionId: this.id,
        toneId: toneScopedPrompt.toneId,
        tonePromptId: toneScopedPrompt.tonePromptId,
        firstCounselTechniqueId: toneScopedPrompt.firstCounselTechniqueId,
      });
      if (clonedToneScopedPrompt.isFailure) {
        return Result.fail<void>(clonedToneScopedPrompt.error as string);
      }
      this.props.toneScopedPrompts.push(clonedToneScopedPrompt.value);
    }

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
