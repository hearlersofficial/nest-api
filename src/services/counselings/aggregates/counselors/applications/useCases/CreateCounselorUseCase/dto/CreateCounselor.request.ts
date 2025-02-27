import { CounselorGender } from "~proto/com/hearlers/v1/model/counsel_pb";

export interface CreateCounselorUseCaseRequest {
  name: string;
  description: string;
  gender: CounselorGender;
}
