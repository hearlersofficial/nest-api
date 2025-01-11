import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";

export const COUNSEL_REPOSITORY = Symbol("COUNSEL_REPOSITORY");

export interface CounselsRepositoryPort {
  create(counsel: Counsels): Promise<Counsels>;
  findMany(props: FindManyPropsInCounselsRepository): Promise<Counsels[] | null>;
  findOne(props: FindOnePropsInCounselsRepository): Promise<Counsels | null>;
  update(counsel: Counsels): Promise<Counsels>;
}

export interface FindManyPropsInCounselsRepository {
  userId?: number;
}

export interface FindOnePropsInCounselsRepository {
  counselId?: number;
}
