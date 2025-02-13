import { CounselorsEntity } from "~shared/core/infrastructure/entities/Counselor.entity";
import { Counselors } from "~counselings/aggregates/counselors/domain/counselors";
import { PsqlCounselorsMapper } from "~counselings/aggregates/counselors/infrastructures/adaptors/mapper/psql.counselors.mapper";
import {
  CounselorsRepositoryPort,
  FindManyPropsInCounselorsRepository,
  FindOnePropsInCounselorsRepository,
} from "~counselings/aggregates/counselors/infrastructures/counselors.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
<<<<<<< HEAD:src/services/counselings/aggregates/counselors/infrastructures/adaptors/psql.counselors.repository.adaptor.ts
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
=======
import {
  CounselorsRepositoryPort,
  FindManyPropsInCounselorsRepository,
  FindOnePropsInCounselorsRepository,
} from "../counselors.repository.port";
import { FindManyOptions, FindOptionsWhere, Repository } from "typeorm";
import { Counselors } from "../../domain/counselors";
import { PsqlCounselorsMapper } from "./mapper/psql.counselors.mapper";
import { CounselorsEntity } from "~/src/shared/core/infrastructure/entities/Counselors.entity";
>>>>>>> 270a161 (feat: snowflakeid 추가 새 프로덕트에 맞는 디비 구조 정립):src/aggregates/counselors/infrastructures/adaptors/psql.counselors.repository.adaptor.ts

export class PsqlCounselorsRepositoryAdaptor implements CounselorsRepositoryPort {
  constructor(
    @InjectRepository(CounselorsEntity) private readonly counselorsRepository: Repository<CounselorsEntity>,
  ) {}

  async create(counselor: Counselors): Promise<Counselors> {
    const counselorsEntity = PsqlCounselorsMapper.toEntity(counselor);
    const createdCounselorsEntity = await this.counselorsRepository.save(counselorsEntity);
    return PsqlCounselorsMapper.toDomain(createdCounselorsEntity);
  }

  async findMany(props: FindManyPropsInCounselorsRepository): Promise<Counselors[] | null> {
    const { counselorType } = props;
    const findOptionsWhere: FindOptionsWhere<CounselorsEntity> = {};
    if (counselorType !== null && counselorType !== undefined) {
      findOptionsWhere.counselorType = counselorType;
    }

    const findManyOptions: FindManyOptions<CounselorsEntity> = {
      where: findOptionsWhere,
    };

    const counselorsEntities: CounselorsEntity[] = await this.counselorsRepository.find(findManyOptions);
    return counselorsEntities.map((entity) => PsqlCounselorsMapper.toDomain(entity));
  }

  async findOne(props: FindOnePropsInCounselorsRepository): Promise<Counselors | null> {
    const { counselorId } = props;
    const findOptionsWhere: FindOptionsWhere<CounselorsEntity> = {};
    if (counselorId !== null && counselorId !== undefined) {
      findOptionsWhere.id = counselorId.getString();
    }

    const findOneOptions: FindManyOptions<CounselorsEntity> = {
      where: findOptionsWhere,
    };

    const counselorsEntity: CounselorsEntity = await this.counselorsRepository.findOne(findOneOptions);
    return PsqlCounselorsMapper.toDomain(counselorsEntity);
  }

  async update(counselor: Counselors): Promise<Counselors> {
    const counselorsEntity = PsqlCounselorsMapper.toEntity(counselor);
    const updatedCounselorsEntity = await this.counselorsRepository.save(counselorsEntity, { reload: true });
    return PsqlCounselorsMapper.toDomain(updatedCounselorsEntity);
  }
}
