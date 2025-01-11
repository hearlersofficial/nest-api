import { CounselPromptsEntity } from "~shared/core/infrastructure/entities/CounselPrompts.entity";
import { CounselPrompts } from "~counselings/aggregates/counselPrompts/domain/CounselPrompts";
import { PsqlCounselPromptsMapper } from "~counselings/aggregates/counselPrompts/infrastructures/adaptors/mapper/psql.counselPrompts.mapper";
import {
  CounselPromptsRepositoryPort,
  FindOnePropsInCounselPromptsRepository,
} from "~counselings/aggregates/counselPrompts/infrastructures/counselPrompts.repository.port";

import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from "typeorm";

export class PsqlCounselPromptsRepositoryAdaptor implements CounselPromptsRepositoryPort {
  private readonly counselPromptFindOptionsOrder: FindOptionsOrder<CounselPromptsEntity> = {
    version: "DESC",
    createdAt: "DESC",
  };

  constructor(
    @InjectRepository(CounselPromptsEntity) private readonly counselPromptsRepository: Repository<CounselPromptsEntity>,
  ) {}

  async create(counselPrompt: CounselPrompts): Promise<CounselPrompts> {
    const counselPromptsEntity = PsqlCounselPromptsMapper.toEntity(counselPrompt);
    const createdCounselPromptsEntity: CounselPromptsEntity = await this.counselPromptsRepository.save(
      counselPromptsEntity,
    );
    return PsqlCounselPromptsMapper.toDomain(createdCounselPromptsEntity);
  }

  async findOne(props: FindOnePropsInCounselPromptsRepository): Promise<CounselPrompts | null> {
    const { promptType, id } = props;
    const findOptionsWhere: FindOptionsWhere<CounselPromptsEntity> = {};
    if (promptType !== null || promptType !== undefined) {
      findOptionsWhere.promptType = promptType;
    }
    if (id !== null || id !== undefined) {
      findOptionsWhere.id = id;
    }

    const findOptionsOrder: FindOptionsOrder<CounselPromptsEntity> = this.counselPromptFindOptionsOrder;

    const findOneOptions: FindOneOptions<CounselPromptsEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselPromptsEntity: CounselPromptsEntity = await this.counselPromptsRepository.findOne(findOneOptions);
    return PsqlCounselPromptsMapper.toDomain(counselPromptsEntity);
  }

  async findMany(props: FindOnePropsInCounselPromptsRepository): Promise<CounselPrompts[] | null> {
    const { promptType } = props;
    const findOptionsWhere: FindOptionsWhere<CounselPromptsEntity> = {};
    if (promptType !== null || promptType !== undefined) {
      findOptionsWhere.promptType = promptType;
    }

    const findOptionsOrder: FindOptionsOrder<CounselPromptsEntity> = this.counselPromptFindOptionsOrder;

    const findManyOptions: FindOneOptions<CounselPromptsEntity> = {
      where: findOptionsWhere,
      order: findOptionsOrder,
    };

    const counselPromptsEntities: CounselPromptsEntity[] = await this.counselPromptsRepository.find(findManyOptions);
    return counselPromptsEntities.map((counselPromptsEntity) =>
      PsqlCounselPromptsMapper.toDomain(counselPromptsEntity),
    );
  }

  async update(counselPrompt: CounselPrompts): Promise<CounselPrompts> {
    const counselPromptsEntity = PsqlCounselPromptsMapper.toEntity(counselPrompt);
    const updatedCounselPromptsEntity: CounselPromptsEntity = await this.counselPromptsRepository.save(
      counselPromptsEntity,
      { reload: true },
    );
    return PsqlCounselPromptsMapper.toDomain(updatedCounselPromptsEntity);
  }
}
