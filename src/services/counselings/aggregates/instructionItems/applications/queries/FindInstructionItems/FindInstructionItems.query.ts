// import { HttpStatusBasedRpcException } from "~shared/filters/exceptions";

// import { HttpStatus } from "@nestjs/common";

export interface FindInstructionItemsQueryProps {
  keyword?: string;
}

export class FindInstructionItemsQuery {
  constructor(public readonly props: FindInstructionItemsQueryProps) {
    this.validate();
  }

  validate(): void {
    // if (!this.props.keyword) {
    //   throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "keyword is required");
    // }
  }
}
