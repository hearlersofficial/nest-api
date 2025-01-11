import { HttpStatus } from "@nestjs/common";
import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";

export class FindOneUserQuery {
  constructor(public readonly props: FindOneUserQueryProps) {
    this.validateProps(props);
  }

  private validateProps(props: FindOneUserQueryProps): void {
    if (!props.userId && !props.nickname) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "UserId or nickname is required");
    }
  }
}

interface FindOneUserQueryProps {
  userId?: number;
  nickname?: string;
}
