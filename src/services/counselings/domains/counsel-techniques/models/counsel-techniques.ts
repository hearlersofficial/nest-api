import { getNowDayjs } from "~common/shared/utils/date";
import { isDefined } from "~common/shared/utils/validate";
import { AggregateRoot } from "~common/shared-kernel/domains/aggregate-root";
import { Result } from "~common/shared-kernel/domains/results";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { ToneId } from "~common/shared-kernel/identifiers/tone.id";
import { Dayjs } from "dayjs";

export interface CounselTechniquesNewProps {
  promptVersionId: PromptVersionId;
  name: string;
  temperature: number;
  toneId: ToneId;
  context: string;
  instruction: string;
  isStartTechnique: boolean;
}

export interface CounselTechniquesProps extends CounselTechniquesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselTechniques extends AggregateRoot<CounselTechniquesProps, CounselTechniqueId> {
  private constructor(props: CounselTechniquesProps, id: CounselTechniqueId) {
    super(props, id);
  }

  public static create(props: CounselTechniquesProps, id: CounselTechniqueId): Result<CounselTechniques> {
    const counselTechniques = new CounselTechniques(props, id);
    const validateResult = counselTechniques.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselTechniques>(validateResult.error as string);
    }
    return Result.ok<CounselTechniques>(counselTechniques);
  }

  public static createNew(newProps: CounselTechniquesNewProps): Result<CounselTechniques> {
    const now = getNowDayjs();
    const newId = new CounselTechniqueId();
    const createdCounselTechnique = this.create(
      {
        ...newProps,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      newId,
    );

    return createdCounselTechnique;
  }

  validateDomain(): Result<void> {
    // name 검증
    if (!isDefined(this.props.name)) {
      return Result.fail<void>("[CounselTechniques] 이름은 필수입니다");
    }

    // context 검증
    if (!isDefined(this.props.context)) {
      return Result.fail<void>("[CounselTechniques] 컨텍스트는 필수입니다");
    }

    // instruction 검증
    if (!isDefined(this.props.instruction)) {
      return Result.fail<void>("[CounselTechniques] 지시사항은 필수입니다");
    }

    // toneId 검증
    if (!isDefined(this.props.toneId)) {
      return Result.fail<void>("[CounselTechniques] 톤 ID는 필수입니다");
    }

    // 날짜 검증
    if (!isDefined(this.props.createdAt)) {
      return Result.fail<void>("[CounselTechniques] 생성 시간은 필수입니다");
    }
    if (!isDefined(this.props.updatedAt)) {
      return Result.fail<void>("[CounselTechniques] 수정 시간은 필수입니다");
    }

    return Result.ok();
  }

  // Getters
  get promptVersionId(): PromptVersionId {
    return this.props.promptVersionId;
  }

  get name(): string {
    return this.props.name;
  }

  get temperature(): number {
    return this.props.temperature;
  }

  get toneId(): ToneId {
    return this.props.toneId;
  }

  get context(): string {
    return this.props.context;
  }

  get instruction(): string {
    return this.props.instruction;
  }

  get isStartTechnique(): boolean {
    return this.props.isStartTechnique;
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
  public update(props: Partial<CounselTechniquesProps>): Result<void> {
    if (isDefined(props.name) && props.name !== this.props.name) {
      this.props.name = props.name;
    }
    if (isDefined(props.toneId) && !props.toneId.equals(this.props.toneId)) {
      this.props.toneId = props.toneId;
    }
    if (isDefined(props.context) && props.context !== this.props.context) {
      this.props.context = props.context;
    }
    if (isDefined(props.instruction) && props.instruction !== this.props.instruction) {
      this.props.instruction = props.instruction;
    }
    if (isDefined(props.isStartTechnique) && props.isStartTechnique !== this.props.isStartTechnique) {
      this.props.isStartTechnique = props.isStartTechnique;
    }
    this.props.updatedAt = getNowDayjs();
    return Result.ok();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
