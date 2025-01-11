import { CounselorType } from "~proto/com/hearlers/v1/model/counsel_pb";

export interface GetCounselorListUseCaseRequest {
  counselorType?: CounselorType;
}
