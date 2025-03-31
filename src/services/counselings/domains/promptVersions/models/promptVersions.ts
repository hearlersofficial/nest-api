import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { PromptByCounselors } from "~counselings/domains/promptVersions/models/promptByCounselors";
import { PromptByTones } from "~counselings/domains/promptVersions/models/promptByTones";

import { Dayjs } from "dayjs";

export interface PromptVersionsNewProps {}

export interface PromptVersionsProps extends PromptVersionsNewProps {
  name: string;
  description: string;
  promptByCounselors: PromptByCounselors[];
  promptByTones: PromptByTones[];
  isActive: boolean;
  isTemporary: boolean;

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
        promptByCounselors: [],
        promptByTones: [],
        isActive: false,
        isTemporary: true,
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
        promptByCounselors: [],
        promptByTones: [],
        isActive: false,
        isTemporary: true,
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

    for (const promptByCounselor of promptVersion.promptByCounselors) {
      const clonedPromptByCounselor = PromptByCounselors.createNew({
        promptVersionId: clonedVersion.id,
        counselorId: promptByCounselor.counselorId,
        personaPromptId: promptByCounselor.personaPromptId,
      });
      if (clonedPromptByCounselor.isFailure) {
        return Result.fail<PromptVersions>(clonedPromptByCounselor.error as string);
      }
      clonedVersion.props.promptByCounselors.push(clonedPromptByCounselor.value);
    }

    for (const promptByTone of promptVersion.promptByTones) {
      const clonedPromptByTone = PromptByTones.createNew({
        promptVersionId: clonedVersion.id,
        toneId: promptByTone.toneId,
        tonePromptId: promptByTone.tonePromptId,
        firstCounselTechniqueId: promptByTone.firstCounselTechniqueId,
      });
      if (clonedPromptByTone.isFailure) {
        return Result.fail<PromptVersions>(clonedPromptByTone.error as string);
      }
      clonedVersion.props.promptByTones.push(clonedPromptByTone.value);
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

    // promptByCounselors 검증
    if (this.props.promptByCounselors.length > 0) {
      for (const promptByCounselor of this.props.promptByCounselors) {
        if (!promptByCounselor.promptVersionId.equals(this.id)) {
          return Result.fail<void>("[PromptVersions] PromptByCounselors의 ID가 일치하지 않습니다");
        }
      }
    }

    // promptByTones 검증
    if (this.props.promptByTones.length > 0) {
      for (const promptByTone of this.props.promptByTones) {
        if (!promptByTone.promptVersionId.equals(this.id)) {
          return Result.fail<void>("[PromptVersions] PromptByTones의 ID가 일치하지 않습니다");
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

  get promptByCounselors(): PromptByCounselors[] {
    return this.props.promptByCounselors;
  }

  get promptByTones(): PromptByTones[] {
    return this.props.promptByTones;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get isTemporary(): boolean {
    return this.props.isTemporary;
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
  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }

  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = getNowDayjs();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = getNowDayjs();
  }

  public saveVersion(name: string, description: string): void {
    this.props.name = name;
    this.props.description = description;
    this.props.isTemporary = false;
    this.props.updatedAt = getNowDayjs();
  }

  public updatePromptByCounselor(counselorId: UniqueEntityId, personaPromptId: UniqueEntityId): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary versions can be updated.");
    }
    for (const promptByCounselor of this.props.promptByCounselors) {
      if (promptByCounselor.counselorId.equals(counselorId)) {
        promptByCounselor.update({ personaPromptId });
        this.props.updatedAt = getNowDayjs();
        return Result.ok<void>();
      }
    }
    const newPromptByCounselor = PromptByCounselors.createNew({
      promptVersionId: this.id,
      counselorId,
      personaPromptId,
    });
    if (newPromptByCounselor.isFailure) {
      return Result.fail<void>(newPromptByCounselor.error as string);
    }
    this.props.promptByCounselors.push(newPromptByCounselor.value);
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }
  public updatePromptByTone(toneId: UniqueEntityId, tonePromptId: UniqueEntityId, firstCounselTechniqueId: UniqueEntityId): Result<void> {
    if (!this.props.isTemporary) {
      return Result.fail<void>("[PromptVersions] Only temporary versions can be updated.");
    }
    for (const promptByTone of this.props.promptByTones) {
      if (promptByTone.toneId.equals(toneId)) {
        promptByTone.update({ tonePromptId, firstCounselTechniqueId });
        this.props.updatedAt = getNowDayjs();
        return Result.ok<void>();
      }
    }
    const newPromptByTone = PromptByTones.createNew({
      promptVersionId: this.id,
      toneId,
      tonePromptId,
      firstCounselTechniqueId,
    });
    if (newPromptByTone.isFailure) {
      return Result.fail<void>(newPromptByTone.error as string);
    }
    this.props.promptByTones.push(newPromptByTone.value);
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public clonePrompts(promptVersion: PromptVersions): Result<void> {
    this.props.isTemporary = true;
    this.props.isActive = false;
    this.props.name = "Temporary name";
    this.props.description = "Temporary description";
    this.props.promptByCounselors = [];
    this.props.promptByTones = [];
    this.props.updatedAt = getNowDayjs();

    for (const promptByCounselor of promptVersion.promptByCounselors) {
      const clonedPromptByCounselor = PromptByCounselors.createNew({
        promptVersionId: this.id,
        counselorId: promptByCounselor.counselorId,
        personaPromptId: promptByCounselor.personaPromptId,
      });
      if (clonedPromptByCounselor.isFailure) {
        return Result.fail<void>(clonedPromptByCounselor.error as string);
      }
      this.props.promptByCounselors.push(clonedPromptByCounselor.value);
    }

    for (const promptByTone of promptVersion.promptByTones) {
      const clonedPromptByTone = PromptByTones.createNew({
        promptVersionId: this.id,
        toneId: promptByTone.toneId,
        tonePromptId: promptByTone.tonePromptId,
        firstCounselTechniqueId: promptByTone.firstCounselTechniqueId,
      });
      if (clonedPromptByTone.isFailure) {
        return Result.fail<void>(clonedPromptByTone.error as string);
      }
      this.props.promptByTones.push(clonedPromptByTone.value);
    }

    return Result.ok<void>();
  }
}
