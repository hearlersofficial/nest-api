import { HttpStatusBasedRpcException } from "~/src/shared/filters/exceptions";
import { CounselMessages } from "~counselings/aggregates/counselMessages/domain/CounselMessages";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

import { HttpStatus } from "@nestjs/common";

export class CreateCounselCommand {
  constructor(public readonly props: CreateCounselCommandProps) {
    this.validate(props);
  }

  private validate(props: CreateCounselCommandProps): void {
    if (props.userId === null || props.userId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "사용자 ID는 필수입니다.");
    }

    if (props.counselorId === null || props.counselorId === undefined) {
      throw new HttpStatusBasedRpcException(HttpStatus.BAD_REQUEST, "상담사 ID는 필수입니다.");
    }

    if (
      !(props.introMessage === null || props.introMessage === undefined) &&
      (props.responseMessage === null || props.responseMessage === undefined)
    ) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.BAD_REQUEST,
        "시작 메시지가 있을 경우 응답 메시지는 필수입니다.",
      );
    }
    if (
      (props.introMessage === null || props.introMessage === undefined) &&
      !(props.responseMessage === null || props.responseMessage === undefined)
    ) {
      throw new HttpStatusBasedRpcException(
        HttpStatus.BAD_REQUEST,
        "응답 메시지가 있을 경우 시작 메시지는 필수입니다.",
      );
    }
  }
}

interface CreateCounselCommandProps {
  userId: number;
  counselorId: number;
  introMessage?: string;
  responseMessage?: string;
}

export interface CreateCounselCommandResult {
  counsel: Counsels;
  counselMessages: CounselMessages[];
}
