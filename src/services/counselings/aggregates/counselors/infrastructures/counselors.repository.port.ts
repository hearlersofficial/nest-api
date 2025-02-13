import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { CounselorType } from "~proto/com/hearlers/v1/model/counsel_pb";

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
  counselorId?: UniqueEntityId;
}
