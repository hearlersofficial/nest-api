// import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

// import { HttpStatus } from "@nestjs/common";

export interface FindTonesQueryProps {
  name?: string;
}

export class FindTonesQuery {
  constructor(public readonly props: FindTonesQueryProps) {
    this.validate();
  }

  validate(): void {
    // if (!this.props.name) {
    //   throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "name is required");
    // }
  }
}
