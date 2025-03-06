// import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

// import { HttpStatus } from "@nestjs/common";

export interface FindContextsQueryProps {
  name?: string;
}

export class FindContextsQuery {
  constructor(public readonly props: FindContextsQueryProps) {
    this.validate();
  }

  validate(): void {
    // if (!this.props.name) {
    //   throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "name is required");
    // }
  }
}
