import { DomainEntity } from "~/src/shared/core/domain/DomainEntity";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
import { Result } from "~/src/shared/core/domain/Result";
import { Dayjs } from "dayjs";
import { getNowDayjs } from "~/src/shared/utils/Date.utils";
import { Context, Analysis, DomainConversation } from "~/src/shared/types/prompts.types";
import { EmotionalState } from "~/src/shared/enums/EmotionalState.enum";

interface UserPromptsNewProps {
  userId: UniqueEntityId;
  templateId: UniqueEntityId;
  context: Context;
}

interface UserPromptsProps extends UserPromptsNewProps {
  generatedPrompt: string;
  conversationHistory: DomainConversation[];
  analysis?: Analysis;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  deletedAt: Dayjs | null;
}

export class UserPrompts extends DomainEntity<UserPromptsProps> {
  private constructor(props: UserPromptsProps, id: UniqueEntityId) {
    super(props, id);
  }

  public static create(props: UserPromptsProps, id: UniqueEntityId): Result<UserPrompts> {
    const userPrompts = new UserPrompts(props, id);
    const validateResult = userPrompts.validateDomain();
    if (validateResult.isFailure) {
      return Result.fail<UserPrompts>(validateResult.error);
    }
    return Result.ok<UserPrompts>(userPrompts);
  }

  public static createNew(newProps: UserPromptsNewProps): Result<UserPrompts> {
    const now = getNowDayjs();
    return this.create(
      {
        ...newProps,
        generatedPrompt: "", // 초기에는 비어있음
        conversationHistory: [],
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      },
      new UniqueEntityId(),
    );
  }

  validateDomain(): Result<void> {
    // userId 검증
    if (!this.props.userId) {
      return Result.fail<void>("[UserPrompts] 사용자 ID는 필수입니다");
    }

    // templateId 검증
    if (!this.props.templateId) {
      return Result.fail<void>("[UserPrompts] 템플릿 ID는 필수입니다");
    }

    // context 검증
    if (!this.props.context) {
      return Result.fail<void>("[UserPrompts] 컨텍스트는 필수입니다");
    }
    if (!this.props.context.emotionalState) {
      return Result.fail<void>("[UserPrompts] 감정 상태는 필수입니다");
    }
    if (!Object.values(EmotionalState).includes(this.props.context.emotionalState)) {
      return Result.fail<void>("[UserPrompts] 유효하지 않은 감정 상태입니다");
    }

    // conversationHistory 검증
    if (!Array.isArray(this.props.conversationHistory)) {
      return Result.fail<void>("[UserPrompts] 대화 히스토리는 배열이어야 합니다");
    }
    for (const conv of this.props.conversationHistory) {
      if (!["user", "assistant"].includes(conv.role)) {
        return Result.fail<void>("[UserPrompts] 유효하지 않은 대화 역할입니다");
      }
      if (!conv.content) {
        return Result.fail<void>("[UserPrompts] 대화 내용은 필수입니다");
      }
      if (!conv.timestamp) {
        return Result.fail<void>("[UserPrompts] 대화 시간은 필수입니다");
      }
    }

    return Result.ok<void>();
  }

  // Getters
  get userId(): UniqueEntityId {
    return this.props.userId;
  }

  get templateId(): UniqueEntityId {
    return this.props.templateId;
  }

  get context(): Context {
    return this.props.context;
  }

  get generatedPrompt(): string {
    return this.props.generatedPrompt;
  }

  get conversationHistory(): DomainConversation[] {
    return [...this.props.conversationHistory];
  }

  get analysis(): Analysis | undefined {
    return this.props.analysis ? { ...this.props.analysis } : undefined;
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
  public setGeneratedPrompt(prompt: string): Result<void> {
    if (!prompt) {
      return Result.fail<void>("[UserPrompts] 프롬프트는 비어있을 수 없습니다");
    }
    this.props.generatedPrompt = prompt;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public addConversation(role: "user" | "assistant", content: string): Result<void> {
    if (!content) {
      return Result.fail<void>("[UserPrompts] 대화 내용은 비어있을 수 없습니다");
    }

    this.props.conversationHistory.push({
      role,
      content,
      timestamp: getNowDayjs(),
    });
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public updateAnalysis(analysis: Analysis): Result<void> {
    this.props.analysis = analysis;
    this.props.updatedAt = getNowDayjs();
    return Result.ok<void>();
  }

  public delete(): void {
    this.props.deletedAt = getNowDayjs();
  }

  public restore(): void {
    this.props.deletedAt = null;
  }
}
