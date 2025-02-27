export class GetCounselorListQuery {
  constructor(public readonly props: GetCounselorListQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: GetCounselorListQueryProps): void {}
}

interface GetCounselorListQueryProps {}
