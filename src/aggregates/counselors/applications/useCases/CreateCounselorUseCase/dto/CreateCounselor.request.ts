import { CounselorGender, CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";

export interface CreateCounselorUseCaseRequest {
  counselorType: CounselorType;
  name: string;
  description: string;
  gender: CounselorGender;
}
