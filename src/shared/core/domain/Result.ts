export class Result<T> {
  private readonly _value?: T;
  public readonly error?: string;

  public isSuccess: boolean;
  public isFailure: boolean;

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

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static getFailResultIfExist(results: Result<unknown>[]): Result<unknown> | null {
    for (const result of results) {
      if (result.isFailure) {
        return result;
      }
    }

    return null;
  }
}
