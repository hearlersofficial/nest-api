import { CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";

export interface GetCounselorListUseCaseRequest {
  counselorType?: CounselorType;
}
