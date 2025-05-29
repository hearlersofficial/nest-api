import { Result } from "~shared/core/domain/Result";
import { ValueObject } from "~shared/core/domain/ValueObject";

export interface LlmResponseProps {
  content: string | null;
}

export class LlmResponse extends ValueObject<LlmResponseProps> {
  private constructor(props: LlmResponseProps) {
    super(props);
  }

  public static create(props: LlmResponseProps): Result<LlmResponse> {
    const llmResponse = new LlmResponse(props);
    const validateResult = llmResponse.validateValueObject();
    if (validateResult.isFailure) {
      return Result.fail(validateResult.error as string);
    }
    return Result.ok<LlmResponse>(llmResponse);
  }

  private validateValueObject(): Result<void> {
    return Result.ok();
  }

  get content(): string | null {
    return this.props.content;
  }
}
