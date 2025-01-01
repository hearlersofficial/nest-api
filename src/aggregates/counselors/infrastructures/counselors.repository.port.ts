import { CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { Counselors } from "../domain/counselors";

export const COUNSELOR_REPOSITORY = Symbol("COUNSELOR_REPOSITORY");

export interface CounselorsRepositoryPort {
  create(counselor: Counselors): Promise<Counselors>;
  findMany(props: FindManyPropsInCounselorsRepository): Promise<Counselors[] | null>;
  findOne(props: FindOnePropsInCounselorsRepository): Promise<Counselors | null>;
  update(counselor: Counselors): Promise<Counselors>;
}

export interface FindManyPropsInCounselorsRepository {
  counselorType?: CounselorType;
}

export interface FindOnePropsInCounselorsRepository {
  counselorId?: number;
}
