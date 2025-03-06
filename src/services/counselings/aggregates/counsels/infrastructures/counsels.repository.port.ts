import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
export const COUNSEL_REPOSITORY = Symbol("COUNSEL_REPOSITORY");

export interface CounselsRepositoryPort {
  create(counsel: Counsels): Promise<Counsels>;
  update(counsel: Counsels): Promise<Counsels>;
  findOne(counselId: UniqueEntityId): Promise<Counsels | null>;
  findAll(): Promise<Counsels[]>;
  findMany(props: FindManyPropsInCounselsRepository): Promise<Counsels[]>;
}

export interface FindManyPropsInCounselsRepository {
  userId?: UniqueEntityId;
  counselorId?: UniqueEntityId;
}
