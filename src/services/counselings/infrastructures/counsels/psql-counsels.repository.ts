import { UniqueEntityId } from "~shared/core/domain/UniqueEntityId";
import { CounselsEntity } from "~shared/core/infrastructure/entities/counsels/Counsels.entity";
import { Counsels } from "~counselings/domains/counsels/models/counsels";
import { CounselsRepository } from "~counselings/infrastructures/counsels/counsels.repository";
import { PsqlCounselsMapper } from "~counselings/infrastructures/counsels/mappers/psql.counsels.mapper";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class PsqlCounselsRepository extends CounselsRepository {
  constructor(
    @InjectRepository(CounselsEntity)
    private readonly counselsRepository: Repository<CounselsEntity>,
  ) {
    super();
  }

  override async findByCounselId(counselId: UniqueEntityId, options?: FindOneOptions<CounselsEntity>): Promise<Counsels | null> {
    const findOneOptions: FindOneOptions<CounselsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselId.getString(),
    };
    const counsel = await this.counselsRepository.findOne(findOneOptions);
    return counsel ? PsqlCounselsMapper.toDomain(counsel) : null;
  }

  override async findMany(options?: FindManyOptions<CounselsEntity>): Promise<Counsels[]> {
    const findManyOptions: FindManyOptions<CounselsEntity> = options ?? {};
    const counsels = await this.counselsRepository.find(findManyOptions);
    return PsqlCounselsMapper.toDomains(counsels);
  }

  override async save(counsel: Counsels): Promise<Counsels>;
  override async save(counsels: Counsels[]): Promise<Counsels[]>;
  async save(counsel: Counsels | Counsels[]): Promise<Counsels | Counsels[]> {
    if (Array.isArray(counsel)) {
      await this.counselsRepository.save(PsqlCounselsMapper.toEntities(counsel));
      return counsel;
    } else {
      const counselEntity = PsqlCounselsMapper.toEntity(counsel);
      await this.counselsRepository.save(counselEntity);
      return counsel;
    }
  }
}
