import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export interface ProceedCounselingRequest {
  counsel: Counsels;
  userMessage: string;
}
