import { CounselTechniqueTransitionRulesRepository } from "~counselings/domains/counsel-techniques/infrastructures/counsel-technique-transition-rules.repository";
import { TypeormCounselTechniqueTransitionRulesMapper } from "~counselings/domains/counsel-techniques/infrastructures/mappers/typeorm-counsel-technique-transition-rules.mapper";
import { CounselTechniqueTransitionRules } from "~counselings/domains/counsel-techniques/models/counsel-technique-transition-rules";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CounselTechniqueId } from "~common/shared-kernel/identifiers/counsel-techinque.id";
import { CounselTechniqueTransitionRuleId } from "~common/shared-kernel/identifiers/counsel-technique-transition-rule.id";
import { PromptVersionId } from "~common/shared-kernel/identifiers/prompt-version.id";
import { CounselTechniqueTransitionRuleEntity } from "~common/system/persistences/entities/prompts/counsel-technique-transition-rules.entity";
import { FindManyOptions, FindOneOptions, Repository } from "typeorm";

@Injectable()
export class TypeormCounselTechniqueTransitionRulesRepository extends CounselTechniqueTransitionRulesRepository {
  constructor(
    @InjectRepository(CounselTechniqueTransitionRuleEntity)
    private readonly counselTechniqueTransitionRuleRepository: Repository<CounselTechniqueTransitionRuleEntity>,
  ) {
    super();
  }
  private readonly mapper = TypeormCounselTechniqueTransitionRulesMapper;

  override async findById(
    id: CounselTechniqueTransitionRuleId,
    options?: FindOneOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules | null> {
    const findOneOptions: FindOneOptions<CounselTechniqueTransitionRuleEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      id: id.getString(),
    };
    const counselTechniqueTransitionRule = await this.counselTechniqueTransitionRuleRepository.findOne(findOneOptions);
    return counselTechniqueTransitionRule ? this.mapper.toDomain(counselTechniqueTransitionRule) : null;
  }

  override async findEdge(
    fromCounselTechniqueId: CounselTechniqueId,
    toCounselTechniqueId: CounselTechniqueId,
    promptVersionId: PromptVersionId,
    options?: FindOneOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules | null> {
    const findOneOptions: FindOneOptions<CounselTechniqueTransitionRuleEntity> = options ?? {};
    findOneOptions.where = {
      ...findOneOptions.where,
      fromCounselTechniqueId: fromCounselTechniqueId.getString(),
      toCounselTechniqueId: toCounselTechniqueId.getString(),
      promptVersionId: promptVersionId.getString(),
    };
    const counselTechniqueTransitionRule = await this.counselTechniqueTransitionRuleRepository.findOne(findOneOptions);
    return counselTechniqueTransitionRule ? this.mapper.toDomain(counselTechniqueTransitionRule) : null;
  }

  override async findMany(
    options?: FindManyOptions<CounselTechniqueTransitionRuleEntity>,
  ): Promise<CounselTechniqueTransitionRules[]> {
    const counselTechniqueTransitionRules = await this.counselTechniqueTransitionRuleRepository.find(options);
    return this.mapper.toDomains(counselTechniqueTransitionRules);
  }

  override async save(
    counselTechniqueTransitionRule: CounselTechniqueTransitionRules,
  ): Promise<CounselTechniqueTransitionRules>;
  override async save(
    counselTechniqueTransitionRule: CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules[]>;
  async save(
    counselTechniqueTransitionRules: CounselTechniqueTransitionRules | CounselTechniqueTransitionRules[],
  ): Promise<CounselTechniqueTransitionRules | CounselTechniqueTransitionRules[]> {
    if (Array.isArray(counselTechniqueTransitionRules)) {
      const entities = this.mapper.toEntities(counselTechniqueTransitionRules);
      const savedEntities = await this.counselTechniqueTransitionRuleRepository.save(entities);
      return this.mapper.toDomains(savedEntities);
    } else {
      const entity = this.mapper.toEntity(counselTechniqueTransitionRules);
      const savedEntity = await this.counselTechniqueTransitionRuleRepository.save(entity);
      return this.mapper.toDomain(savedEntity);
    }
  }
}
