<<<<<<< HEAD:src/services/counselings/aggregates/counselors/infrastructures/counselors.repository.port.ts
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { CounselorType } from "~proto/com/hearlers/v1/model/counsel_pb";
=======
import { CounselorType } from "~/src/gen/com/hearlers/v1/model/counsel_pb";
import { Counselors } from "../domain/counselors";
import { UniqueEntityId } from "~/src/shared/core/domain/UniqueEntityId";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselors/infrastructures/counselors.repository.port.ts

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
