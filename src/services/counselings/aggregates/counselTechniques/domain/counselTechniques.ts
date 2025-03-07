import { AggregateRoot } from "~shared/core/domain/AggregateRoot";
import { Result } from "~shared/core/domain/Result";
import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { getNowDayjs } from "~shared/utils/Date.utils";
import { isDefined } from "~shared/utils/Validate.utils";
import { CounselTechniqueStage } from "~proto/com/hearlers/v1/model/counsel_pb";

import { Dayjs } from "dayjs";

export interface CounselTechniquesNewProps {
  name: string;
  toneId: UniqueEntityId | null;
  contextId: UniqueEntityId;
  instructionId: UniqueEntityId;
  counselTechniqueStage: CounselTechniqueStage;
  nextTechniqueId: UniqueEntityId | null;
}

export interface CounselTechniquesProps extends CounselTechniquesNewProps {
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class CounselTechniques extends AggregateRoot<CounselTechniquesProps> {
  private constructor(props: CounselTechniquesProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: CounselTechniquesProps, id: UniqueEntityId): Result<CounselTechniques> {
    const counselTechniques = new CounselTechniques(props, id);
    const validateResult = counselTechniques.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<CounselTechniques>(validateResult.error as string);
    }
    return Result.ok<CounselTechniques>(counselTechniques);
  }

  public static createNew(newProps: CounselTechniquesNewProps): Result<CounselTechniques> {
    const now = getNowDayjs();
    const newId = new UniqueEntityId();
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
    if (this.props.name === null || this.props.name === undefined) {
      return Result.fail<void>("[CounselTechniques] 이름은 필수입니다");
    }

    // contextId 검증
    if (this.props.contextId === null || this.props.contextId === undefined) {
      return Result.fail<void>("[CounselTechniques] 컨텍스트 ID는 필수입니다");
    }

    // instructionId 검증
    if (this.props.instructionId === null || this.props.instructionId === undefined) {
      return Result.fail<void>("[CounselTechniques] 지시사항 ID는 필수입니다");
    }

    // counselTechniqueStage 검증
    if (this.props.counselTechniqueStage === null || this.props.counselTechniqueStage === undefined) {
      return Result.fail<void>("[CounselTechniques] 상담 기법 단계는 필수입니다");
    }
    if (!Object.values(CounselTechniqueStage).includes(this.props.counselTechniqueStage)) {
      return Result.fail<void>("[CounselTechniques] 유효하지 않은 상담 기법 단계입니다");
    }
    if (this.props.counselTechniqueStage === CounselTechniqueStage.UNSPECIFIED) {
      return Result.fail<void>("[CounselTechniques] 상담 기법 단계가 지정되지 않았습니다");
    }

    // 날짜 검증
    if (!this.props.createdAt) {
      return Result.fail<void>("[CounselTechniques] 생성 시간은 필수입니다");
    }
    if (!this.props.updatedAt) {
      return Result.fail<void>("[CounselTechniques] 수정 시간은 필수입니다");
    }

    return Result.ok<void>();
  }

  // Getters
  get name(): string {
    return this.props.name;
  }

  get toneId(): UniqueEntityId | null {
    return this.props.toneId;
  }

  get contextId(): UniqueEntityId {
    return this.props.contextId;
  }

  get instructionId(): UniqueEntityId {
    return this.props.instructionId;
  }

  get counselTechniqueStage(): CounselTechniqueStage {
    return this.props.counselTechniqueStage;
  }

  get nextTechniqueId(): UniqueEntityId | null {
    return this.props.nextTechniqueId;
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
  public update(props: Partial<CounselTechniquesProps>): void {
    if (isDefined(props.name) && props.name !== this.props.name) {
      this.props.name = props.name;
    }
    if (props.toneId !== undefined && props.toneId !== this.props.toneId) {
      this.props.toneId = props.toneId;
    }
    if (isDefined(props.contextId) && props.contextId !== this.props.contextId) {
      this.props.contextId = props.contextId;
    }
    if (isDefined(props.instructionId) && props.instructionId !== this.props.instructionId) {
      this.props.instructionId = props.instructionId;
    }
    if (isDefined(props.counselTechniqueStage) && props.counselTechniqueStage !== this.props.counselTechniqueStage) {
      this.props.counselTechniqueStage = props.counselTechniqueStage;
    }
    if (props.nextTechniqueId !== undefined && props.nextTechniqueId !== this.props.nextTechniqueId) {
      this.props.nextTechniqueId = props.nextTechniqueId;
    }
    this.props.updatedAt = getNowDayjs();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
