import { Result } from "~common/shared-kernel/domains/Result";
import { ValueObject } from "~common/shared-kernel/domains/ValueObject";

export type LlmRole = "system" | "user" | "assistant";

export interface LlmRequestProps {
  role: LlmRole;
  content: string;
}

export class LlmRequest extends ValueObject<LlmRequestProps> {
  private constructor(props: LlmRequestProps) {
    super(props);
  }

  public static create(props: LlmRequestProps): Result<LlmRequest> {
    const llmRequest = new LlmRequest(props);
    const validateResult = llmRequest.validateValueObject();
    if (validateResult.isFailure) {
      return Result.fail(validateResult.error as string);
    }
    return Result.ok<LlmRequest>(llmRequest);
  }

  private validateValueObject(): Result<void> {
    if (!this.props.role) {
      return Result.fail("[LlmRequest] Role is required.");
    }

    if (!this.props.content) {
      return Result.fail("[LlmRequest] Content is required.");
    }

    return Result.ok();
  }

  get role(): LlmRole {
    return this.props.role;
  }

  get content(): string {
    return this.props.content;
  }
}
