export class Result<T> {
  private readonly _value?: T;
  public readonly error?: string;
  public readonly isSuccess: boolean;
  public readonly isFailure: boolean;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
    Object.freeze(this);
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error(this.error);
    }
    return this._value as T;
  }

  get errorValue(): string {
    return this.error ?? "unspecified error";
  }

  public static ok<U>(value: U): Result<U> & {
    isSuccess: true;
    isFailure: false;
    value: U;
    error?: undefined;
  } {
    return new Result<U>(true, undefined, value) as any;
  }

  public static fail<U = never>(
    error: string,
  ): Result<U> & {
    isSuccess: false;
    isFailure: true;
    error: string;
    value?: undefined;
  } {
    return new Result<U>(false, error) as any;
  }

  public static getFailResultIfExist(results: Result<unknown>[]):
    | (Result<unknown> & {
        isSuccess: false;
        isFailure: true;
        error: string;
        value?: undefined;
      })
    | null {
    for (const result of results) {
      if (result.isFailure) {
        return result as any;
      }
    }
    return null;
  }

  public isFailureResult(): this is Result<T> & { error: string } {
    return this.isFailure;
  }

  public isSuccessResult(): this is Result<T> & { value: T } {
    return this.isSuccess;
  }
}
