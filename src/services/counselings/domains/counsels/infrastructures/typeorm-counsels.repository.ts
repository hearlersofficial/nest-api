import { CounselsRepository } from "~counselings/domains/counsels/infrastructures/counsels.repository";
import { TypeormCounselsMapper } from "~counselings/domains/counsels/infrastructures/mappers/typeorm-counsels.mapper";
import { Counsels } from "~counselings/domains/counsels/models/counsels";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselId } from "~common/shared-kernel/identifiers/counsel.id";
import { CounselsEntity } from "~common/system/persistences/entities/counsels/counsel.entity";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";

@Injectable()
export class TypeormCounselsRepository extends CounselsRepository {
  constructor(
    @InjectRepository(CounselsEntity)
    private readonly counselsRepository: Repository<CounselsEntity>,
  ) {
    super();
  }

  private readonly DEFAULT_RELATIONS: FindOptionsRelations<CounselsEntity> = {
    counselContext: true,
  };

  override async findByCounselId(
    counselId: CounselId,
    options?: FindOneOptions<CounselsEntity>,
  ): Promise<Counsels | null> {
    const findOneOptions: FindOneOptions<CounselsEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: counselId.getString(),
    };
    findOneOptions.relations = {
      ...findOneOptions.relations,
      ...this.DEFAULT_RELATIONS,
    };
    const counsel = await this.counselsRepository.findOne(findOneOptions);
    return counsel ? TypeormCounselsMapper.toDomain(counsel) : null;
  }

  override async findMany(options?: FindManyOptions<CounselsEntity>): Promise<Counsels[]> {
    const findManyOptions: FindManyOptions<CounselsEntity> = options ?? {};
    findManyOptions.relations = {
      ...findManyOptions.relations,
      ...this.DEFAULT_RELATIONS,
    };
    const counsels = await this.counselsRepository.find(findManyOptions);
    return TypeormCounselsMapper.toDomains(counsels);
  }

  override async save(counsel: Counsels): Promise<Counsels>;
  override async save(counsels: Counsels[]): Promise<Counsels[]>;
  async save(counsel: Counsels | Counsels[]): Promise<Counsels | Counsels[]> {
    if (Array.isArray(counsel)) {
      await this.counselsRepository.save(TypeormCounselsMapper.toEntities(counsel));
      return counsel;
    } else {
      const counselEntity = TypeormCounselsMapper.toEntity(counsel);
      await this.counselsRepository.save(counselEntity);
      return counsel;
    }
  }
}
