interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo.props === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  public getProps(): T {
    return this.props;
  }

  protected static isValueObject(v: any): v is ValueObject<any> {
    return v instanceof ValueObject;
  }
}
