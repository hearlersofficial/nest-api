<<<<<<< HEAD:src/services/counselings/aggregates/counsels/infrastructures/counsels.repository.port.ts
import { Counsels } from "~counselings/aggregates/counsels/domain/Counsels";
=======
import { Counsels } from "~/src/aggregates/counsels/domain/Counsels";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counsels/infrastructures/counsels.repository.port.ts

export const COUNSEL_REPOSITORY = Symbol("COUNSEL_REPOSITORY");

export interface CounselsRepositoryPort {
  create(counsel: Counsels): Promise<Counsels>;
  findMany(props: FindManyPropsInCounselsRepository): Promise<Counsels[] | null>;
  findOne(props: FindOnePropsInCounselsRepository): Promise<Counsels | null>;
  update(counsel: Counsels): Promise<Counsels>;
}

export interface FindManyPropsInCounselsRepository {
  userId?: UniqueEntityId;
}

export interface FindOnePropsInCounselsRepository {
  counselId?: UniqueEntityId;
}
