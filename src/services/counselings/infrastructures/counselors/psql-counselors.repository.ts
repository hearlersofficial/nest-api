import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselorEntity } from "~shared/core/infrastructure/entities/counselors/counselor.entity";
import { Counselors } from "~counselings/domains/counselors/models/counselors";
import { CounselorsRepository } from "~counselings/infrastructures/counselors/counselors.repository";
import { PsqlCounselorsMapper } from "~counselings/infrastructures/counselors/mappers/psql.counselors.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlCounselorsRepository extends CounselorsRepository {
  constructor(@InjectRepository(CounselorEntity) private readonly counselorsRepository: Repository<CounselorEntity>) {
    super();
  }

  override async findByCounselorId(
    counselorId: UniqueEntityId,
    options?: FindOneOptions<CounselorEntity>,
  ): Promise<Counselors | null> {
    const findOneOptions: FindOneOptions<CounselorEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselorId.getString(),
    };
    const counselor = await this.counselorsRepository.findOne(findOneOptions);
    return counselor ? PsqlCounselorsMapper.toDomain(counselor) : null;
  }

  override async findMany(options?: FindManyOptions<CounselorEntity>): Promise<Counselors[]> {
    const findManyOptions: FindManyOptions<CounselorEntity> = options ?? {};
    const counselors = await this.counselorsRepository.find(findManyOptions);
    return PsqlCounselorsMapper.toDomains(counselors);
  }

  override async save(counselor: Counselors): Promise<Counselors>;
  override async save(counselors: Counselors[]): Promise<Counselors[]>;
  async save(counselor: Counselors | Counselors[]): Promise<Counselors | Counselors[]> {
    if (Array.isArray(counselor)) {
      await this.counselorsRepository.save(PsqlCounselorsMapper.toEntities(counselor));
      return counselor;
    }
    const counselorEntity = PsqlCounselorsMapper.toEntity(counselor);
    await this.counselorsRepository.save(counselorEntity);
    return counselor;
  }
}
