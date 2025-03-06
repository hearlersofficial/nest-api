import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";

export const COUNSELOR_REPOSITORY = Symbol("COUNSELOR_REPOSITORY");

export interface CounselorsRepositoryPort {
  create(counselor: Counselors): Promise<Counselors>;
  update(counselor: Counselors): Promise<Counselors>;
  findOne(counselorId: UniqueEntityId): Promise<Counselors | null>;
  findAll(): Promise<Counselors[]>;
  findMany(props: FindManyPropsInCounselorsRepository): Promise<Counselors[]>;
}

export interface FindManyPropsInCounselorsRepository {
  name?: string;
  toneId?: UniqueEntityId;
}
